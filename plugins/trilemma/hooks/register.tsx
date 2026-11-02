import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

import type { TrilemmaLimit, TrilemmaSample, TrilemmaUsage } from '../types'

// Warm gray
const C = {
  bg: '#1c1917',
  chip: '#2f2c2a',
  focusChip: '#44403c',
  text: '#f7f7fa',
  secondary: '#a8a29e',
  border: '#44403c',
  focus: '#e7e5e4',
  hover: '#d77757',
  warn: '#ff6b6b',
  danger: '#ff2d2d',
}

const PILLS = [
  { label: 'next', prompt: "What's next?" },
  { label: 'tldr', prompt: 'Give me a TL;DR of your last answer.' },
  { label: 'eli5', prompt: "Explain your last answer like I'm five." },
  { label: 'opinion', prompt: "What's your opinion?" },
  { label: 'recap', prompt: 'Recap the whole session so far.' },
  { label: 'elab', prompt: 'Elaborate on your last answer.' },
]

const SUGGEST_PROMPT = [
  'Suggest exactly 3 prompts I am most likely to send you next. Base them on the conversation above.',
  'Read your last message first. If it asks me a question or offers a choice, make the first prompt my most likely answer, and name the choice.',
  'Make the 3 prompts different: one moves the work forward, one checks or tests the result, and one questions a risk or a loose end.',
  'Use the real file, branch, PR, command, or feature names from the conversation. Never suggest work that is already done.',
  'Write each prompt as I would type it: first person, imperative, specific, and under 100 characters.',
  'Output only the 3 prompts, one per line, with no numbering, bullets, quotes, or other text.',
].join(' ')

const SUGGEST_MESSAGES = 10
const SUGGEST_CHARS = 1500
const SUGGEST_LAST_CHARS = 5000

const WARN = 75
const DANGER = 90
const BURN_WINDOW_MS = 60 * 60 * 1000
const BURN_MIN_SPAN_MS = 10 * 60 * 1000
const BURN_MIN_RISE = 1
// Below this width the strip takes two rows.
const ONE_ROW_COLUMNS = 140

const suggestions = atom({ plugin: 'trilemma', key: 'suggestions' } as const, [] as string[])
const focus = atom({ plugin: 'trilemma', key: 'focus' } as const, 0)
const isDraft = atom({ plugin: 'trilemma', key: 'isDraft' } as const, false)
const isSent = atom({ plugin: 'trilemma', key: 'isSent' } as const, false)
const usage = atom({ plugin: 'trilemma', key: 'usage' } as const, null as TrilemmaUsage | null)
const lastTokens = atom({ plugin: 'trilemma', key: 'lastTokens' } as const, null as number | null)
const samples = atom({ plugin: 'trilemma', key: 'samples' } as const, [] as TrilemmaSample[])
const tick = atom({ plugin: 'trilemma', key: 'tick' } as const, 0)

/** Every selectable item in order: suggestions first, then pills. */
function items(list: string[]): { key: string; prompt: string }[] {
  const rows = list.slice(0, 3).map((prompt, i) => ({ key: String(i + 1), prompt }))
  const pills = PILLS.map((p, i) => ({ key: String(i + 4), prompt: p.prompt }))
  return [...rows, ...pills]
}

/** Recent messages for the model. A long message keeps its end, where the question or next step sits. */
export function suggestionTranscript(messages: { role: string; text: string }[]): string {
  const recent = messages.slice(-SUGGEST_MESSAGES)
  return recent
    .map((m, i) => {
      const chars = i === recent.length - 1 ? SUGGEST_LAST_CHARS : SUGGEST_CHARS
      return `${m.role === 'user' ? 'Me' : 'You'}: ${m.text.slice(-chars)}`
    })
    .join('\n\n')
}

function parseSuggestions(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim().replace(/^(\d+[.)]|[-*•])\s*/, '').replace(/^["'`]|["'`]$/g, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 3)
}

function toUsage(u: {
  context: { tokens?: number; window: number }
  rateLimits: SessionRateLimit[]
  cost?: { usd: number }
}): TrilemmaUsage {
  return {
    costUsd: u.cost?.usd,
    contextTokens: u.context.tokens,
    contextWindow: u.context.window,
    limits: u.rateLimits.map(r => ({ kind: r.kind, percentUsed: r.percentUsed, resetsAt: r.resetsAt })),
  }
}

function tokens(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function duration(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / 60_000))
  const d = Math.floor(minutes / 1440)
  const h = Math.floor((minutes % 1440) / 60)
  const m = minutes % 60
  if (d >= 2) return `${d}d${h}h`
  if (d * 24 + h > 0) return `${d * 24 + h}h${String(m).padStart(2, '0')}m`
  return `${m}m`
}

function levelColor(pct: number): string {
  if (pct >= DANGER) return C.danger
  if (pct >= WARN) return C.warn
  return C.secondary
}

/**
 * Hours until a window reaches 100%, from its readings in the last hour.
 * Undefined when the readings span too little time or rise too little to give a rate,
 * or when the window resets first, so the limit cannot fill.
 */
export function burn(
  all: TrilemmaSample[],
  kind: string,
  now: number,
  resetInMs?: number,
): number | undefined {
  const recent = all.filter(s => s.kind === kind && now - s.at <= BURN_WINDOW_MS)
  if (recent.length < 2) return undefined
  const first = recent[0]
  const last = recent[recent.length - 1]
  if (!first || !last) return undefined
  const span = last.at - first.at
  const rise = last.percentUsed - first.percentUsed
  if (span < BURN_MIN_SPAN_MS || rise < BURN_MIN_RISE) return undefined
  const msLeft = ((100 - last.percentUsed) / rise) * span
  if (resetInMs !== undefined && msLeft >= resetInMs) return undefined
  return msLeft / 3_600_000
}

async function refreshUsage($: EngineInterface): Promise<void> {
  const u = await $.session.usage()
  const now = await $.clock.now()
  await update($, usage, () => toUsage(u))
  await update($, samples, prev =>
    [...(prev ?? []), ...u.rateLimits.map(r => ({ at: now, kind: r.kind, percentUsed: r.percentUsed }))].filter(
      s => now - s.at <= BURN_WINDOW_MS,
    ),
  )
}

/** Asks Haiku for the next prompts from the tail of the conversation. Runs every turn, so it stays small. */
async function suggest($: EngineInterface) {
  const messages = await $.session.messages()
  const transcript = suggestionTranscript(messages)
  return $.model.complete({
    model: 'haiku',
    system: 'You predict what a developer will type next to their coding assistant.',
    prompt: `${transcript}\n\n---\n${SUGGEST_PROMPT}`,
    maxTokens: 300,
    timeoutMs: 20_000,
  })
}

/** Sends once: the first press hides every option, and later presses do nothing until the turn ends. */
async function send($: EngineInterface, text: string): Promise<void> {
  let isFirst = false
  await update($, isSent, prev => {
    isFirst = prev !== true
    return true
  })
  if (!isFirst) return
  // Send first: the prompt.submit hook clears the band's state, and nothing here waits on it.
  $.prompt.submit({ text, asUser: true }).catch(() => {
    $.ui.toast('trilemma: could not send the prompt')
    update($, isSent, () => false).catch(() => undefined)
  })
}

/** Puts the focused item in the empty box as its dim suggestion, so Tab drops it in for editing. */
async function offerFocused($: EngineInterface): Promise<void> {
  const list = await read($, suggestions)
  const all = items(list)
  const item = all[Math.min(await read($, focus), all.length - 1)]
  if (item) await $.prompt.suggest({ text: item.prompt }).catch(() => undefined)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await refreshUsage($).catch(() => undefined)
    $.clock.every(30_000, () => {
      update($, tick, n => (n ?? 0) + 1).catch(() => undefined)
    })
    return result
  })

  on('session.measure', async ($, e, next) => {
    const now = await $.clock.now()
    await update($, usage, () => toUsage(e))
    if (e.changed.includes('rateLimits')) {
      await update($, samples, prev =>
        [...(prev ?? []), ...e.rateLimits.map(r => ({ at: now, kind: r.kind, percentUsed: r.percentUsed }))].filter(
          s => now - s.at <= BURN_WINDOW_MS,
        ),
      )
    }
    return next(e)
  })

  // The engine's own guess would replace ours; only this mod's suggestion shows.
  on('prompt.suggest', { origin: { kind: 'suggestion' } }, () => ({ isShown: false }))


  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result
    await update($, isSent, () => false)
    if (e.usage) {
      const u = e.usage
      await update($, lastTokens, () => u.input_tokens + u.cache_creation_input_tokens + u.output_tokens)
    }
    if (e.reason === 'answer') {
      suggest($)
        .then(async reply => {
          if (!reply.isAnswered) return
          const list = parseSuggestions(reply.text)
          if (list.length === 0) return
          await update($, suggestions, () => list)
          await update($, focus, () => 0)
          await offerFocused($)
        })
        .catch(() => undefined)
    }
    return result
  })

  on('prompt.edit', async ($, e, next) => {
    const box = await next(e)
    const hasText = box.text !== ''
    if (hasText !== (await read($, isDraft))) await update($, isDraft, () => hasText)
    if (!hasText && e.text !== '') await offerFocused($)
    return box
  })

  on('prompt.fill', async ($, e, next) => {
    const result = await next(e)
    if (result.isFilled && e.text !== '') await update($, isDraft, () => true)
    return result
  })

  // A new prompt makes the old suggestions stale.
  // The writes run beside the submission, never ahead of it, so a send is not held up by the band.
  on('prompt.submit', ($, e, next) => {
    // Each write is skipped when the value is already right, so an unchanged value costs no redraw.
    Promise.all([
      read($, isDraft).then(v => (v ? update($, isDraft, () => false) : undefined)),
      read($, suggestions).then(v => (v.length > 0 ? update($, suggestions, () => []) : undefined)),
      read($, focus).then(v => (v !== 0 ? update($, focus, () => 0) : undefined)),
    ]).catch(() => undefined)
    return next(e)
  })

  // A click moves the ring before it presses. The ring moves first and the bookkeeping follows unawaited,
  // so the press lands on the element the person clicked. An unchanged index writes nothing.
  on('ui.focus', { component: 'AbovePrompt' }, async ($, e, next) => {
    const result = await next(e)
    const match = /^item-(\d)$/.exec(e.element ?? '')
    if (match && e.plugin === 'trilemma' && !result.deny) {
      const key = match[1]
      Promise.all([read($, suggestions), read($, focus)])
        .then(async ([list, current]) => {
          const index = items(list).findIndex(i => i.key === key)
          if (index < 0 || index === current) return
          await update($, focus, () => index)
          await offerFocused($)
        })
        .catch(() => undefined)
    }
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const width = e.props.bodyColumns
    await read($, tick)
    const now = await $.clock.now()
    const u = await read($, usage)
    const last = await read($, lastTokens)
    const history = await read($, samples)

    const bar = (pct: number, segments: number, warn: boolean) => {
      const filled = Math.min(segments, Math.round((pct / 100) * segments))
      const color = warn ? levelColor(pct) : C.secondary
      return (
        <Text>
          <Text color={color}>{'▮'.repeat(filled)}</Text>
          <Text color={C.border}>{'⬚'.repeat(segments - filled)}</Text>
        </Text>
      )
    }
    const sep = <Text color={C.border}> | </Text>
    // Desktop draws the segment glyphs wide in its proportional font, so its bars are short.
    const segments = e.surface === 'terminal' ? (width >= 140 ? 12 : width >= 110 ? 8 : 5) : 6

    const limit = (label: string, l: TrilemmaLimit | undefined) => {
      if (!l) return null
      const pct = l.percentUsed
      const color = pct >= WARN ? levelColor(pct) : C.text
      const reset = l.resetsAt ? Date.parse(l.resetsAt) - now : undefined
      const hours = pct >= WARN ? burn(history, l.kind, now, reset) : undefined
      return (
        <Text>
          <Text color={C.secondary}>{label} </Text>
          {bar(pct, segments, true)}
          <Text color={color}> {Math.round(pct)}% used</Text>
          {hours !== undefined ? <Text color={color}> · full in ~{duration(hours * 3_600_000)}</Text> : null}
          {reset !== undefined && reset > 0 ? (
            <Text color={C.secondary}> · resets in {duration(reset)}</Text>
          ) : null}
        </Text>
      )
    }

    // Cost shows only off a subscription: a subscription reports limit windows, and its dollar figure is not a bill.
    const isSubscription = (u?.limits.length ?? 0) > 0
    const ctxPct = u?.contextTokens !== undefined ? (u.contextTokens / u.contextWindow) * 100 : 0
    const fiveHour = u?.limits.find(l => l.kind === 'five_hour')
    const week = u?.limits.find(l => l.kind === 'seven_day')
    const session = (
      <Text wrap="truncate-end">
        {!isSubscription ? (
          <Text>
            <Text color={C.secondary}>cost </Text>
            <Text color={C.text}>${(u?.costUsd ?? 0).toFixed(2)}</Text>
            {sep}
          </Text>
        ) : null}
        {last !== null ? (
          <Text>
            <Text color={C.secondary}>last turn </Text>
            <Text color={C.text}>{tokens(last)}</Text>
            {sep}
          </Text>
        ) : null}
        <Text color={C.secondary}>context </Text>
        {bar(ctxPct, segments, true)}
        <Text color={ctxPct >= WARN ? levelColor(ctxPct) : C.text}>
          {' '}
          {tokens(u?.contextTokens ?? 0)}/{tokens(u?.contextWindow ?? 0)}
        </Text>
      </Text>
    )
    const limits =
      fiveHour || week ? (
        <Text wrap="truncate-end">
          {limit('5h', fiveHour)}
          {fiveHour && week ? sep : null}
          {limit('week', week)}
        </Text>
      ) : null
    // A wide terminal keeps one row. Every other view gets one row for the session and one for the limits.
    const isWide = e.surface === 'terminal' && width >= ONE_ROW_COLUMNS
    const strip = (
      <Box flexDirection={isWide ? 'row' : 'column'} justifyContent="space-between" columnGap={2}>
        {session}
        {limits}
      </Box>
    )

    // Tab takes the dim suggestion without an edit event, so the box itself is the final word.
    // While a prompt is on its way or a turn runs, the options would only invite a second send.
    const isBusy = e.props.isWorking || (await read($, isSent))
    const hasDraft = isBusy || (await read($, isDraft)) || (await $.prompt.read()).text !== ''
    if (hasDraft) {
      return <Box paddingX={1}>{strip}</Box>
    }

    const list = await read($, suggestions)
    const all = items(list)
    // Only the terminal shows a focused item. Desktop does not read it, so a focus change there redraws nothing.
    const focused = e.surface === 'terminal' ? all[Math.min(await read($, focus), all.length - 1)]?.key : undefined
    const sendItem = (prompt: string) => () => {
      send($, prompt).catch(() => undefined)
    }

    // One line per suggestion and one line for every pill: focus is shown by color, not by a frame.
    // Pills are one-line chips that light up under the pointer; rows light up the same way.
    const rows = list.slice(0, 3).map((prompt, i) => {
      const key = String(i + 1)
      const isFocused = key === focused
      const hover = { scope: `row-${key}`, color: C.hover }
      return (
        <Button key={`item-${key}`} plain onPress={sendItem(prompt)}>
          <Text color={isFocused ? C.focus : C.text} bold={isFocused} hover={hover}>
            {prompt}
          </Text>
        </Button>
      )
    })

    // A pill stands out by its own edge: a thin outline where the surface draws one in a line's height
    // (desktop), and a filled chip with half-block caps on the terminal, where a border costs two more rows.
    const pills = PILLS.map((p, i) => {
      const key = String(i + 4)
      const isFocused = key === focused
      const hover = { scope: `pill-${key}`, color: C.hover }
      if (e.surface !== 'terminal') {
        // The desktop's own button chrome: a slim chip, one text line tall. Desktop is pointer-first, so no pill
        // is marked as focused there: the one under the pointer lights up instead.
        return (
          <Button key={`item-${key}`} variant="secondary" hover={hover} onPress={sendItem(p.prompt)}>
            <Text color={C.text} hover={hover}>
              {p.label}
            </Text>
          </Button>
        )
      }
      const chip = isFocused ? C.focusChip : C.chip
      return (
        <Button key={`item-${key}`} plain onPress={sendItem(p.prompt)}>
          <Text color={chip}>▐</Text>
          <Text backgroundColor={chip} color={isFocused ? C.focus : C.text} hover={hover}>
            {p.label}
          </Text>
          <Text color={chip}>▌</Text>
        </Button>
      )
    })

    // A desktop draws each row as a native button taller than its text, so rows need a gap to keep hit areas apart.
    const gap = e.surface === 'terminal' ? 0 : 1
    return (
      <Box flexDirection="column" paddingX={1} rowGap={gap}>
        <Box flexDirection="row" flexWrap="wrap" columnGap={1}>
          {pills}
        </Box>
        {rows}
        {strip}
      </Box>
    )
  })
}
