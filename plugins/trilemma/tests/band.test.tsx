import type { PromptEditInput, PromptEditResult } from 'claude-code'
import type { Engine } from 'claude-code/testing'
import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 20,
    bodyColumns: 150,
    scroll: { offset: 0, bodyRows: 19 },
    view: {},
  },
} as const

const composer = { kind: 'composer' } as const

// The kit's $ raises prompt.edit as the editor does; its typings list only the calls a plugin makes.
type Editor = { edit: (input: PromptEditInput) => Promise<PromptEditResult> }
const edit = ($: Engine, input: Omit<PromptEditInput, 'origin'>) =>
  ($.prompt as unknown as Editor).edit({ origin: composer, ...input })

test('empty composer shows the pills and the usage strip', async ($, on) => {
  mock.clock(on)
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'trilemma', surface, ...BAND })
    expect((await ui.find({ key: 'item-4' }))?.text).toMatch(/next/)
    expect((await ui.find({ key: 'item-9' }))?.text).toMatch(/elab/)
    expect(await ui.find({ text: /T R I L E M M A/ })).toBeDefined()
    expect(await ui.find({ text: /context/ })).toBeDefined()
    await ui.unmount()
  }
})

test('typing hides the pills and keeps the usage strip', async ($, on) => {
  mock.clock(on)
  on('prompt.read', () => ({ value: { text: 'a', cursor: 1 } }))
  on('prompt.edit', () => ({ text: 'a', cursor: 1 }))
  await edit($, { key: { key: 'a' }, text: '', cursor: 0, start: 0, end: 0, inputText: 'a' })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'trilemma', surface, ...BAND })
    expect(await ui.find({ key: 'item-4' })).toBeUndefined()
    expect(await ui.find({ text: /context/ })).toBeDefined()
    await ui.unmount()
  }
})

test('a digit on an empty composer sends its prompt and leaves the box empty', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', ($, e) => {
    sent.push(e.text)
    return { text: e.text }
  })
  const clock = mock.clock(on)
  const box = await edit($, {
    key: { key: '4' },
    text: '',
    cursor: 0,
    start: 0,
    end: 0,
    inputText: '4',
  })
  expect(box.text).toBe('')
  await clock.settle()
  expect(sent).toEqual(["What's next?"])
})

test('a digit inside a draft is typed as usual', async ($, on) => {
  on('prompt.edit', ($, e) => ({ text: e.text + e.inputText, cursor: e.text.length + 1 }))
  const box = await edit($, {
    key: { key: '4' },
    text: 'step ',
    cursor: 5,
    start: 5,
    end: 5,
    inputText: '4',
  })
  expect(box.text).toBe('step 4')
})

test('repeat presses send once and the options hide at once', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', ($, e) => {
    sent.push(e.text)
    return { text: e.text }
  })
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('turn.complete', () => ({ text: '' }))
  const clock = mock.clock(on)
  for (const surface of ['terminal', 'desktop'] as const) {
    sent.length = 0
    const ui = await $.ui.mount({ plugin: 'trilemma', surface, ...BAND })
    await ui.press({ key: 'item-5' })
    expect(await ui.find({ key: 'item-5' })).toBeUndefined()
    expect(await ui.find({ text: /context/ })).toBeDefined()
    await edit($, { key: { key: '6' }, text: '', cursor: 0, start: 0, end: 0, inputText: '6' })
    await clock.settle()
    expect(sent).toEqual(['Give me a TL;DR of your last answer.'])
    await $.turn.complete({ answer: '', durationMs: 1, isAborted: true, turnId: 't', reason: 'aborted' })
    await ui.unmount()
  }
})
