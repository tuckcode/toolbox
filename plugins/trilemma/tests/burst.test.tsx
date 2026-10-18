import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 20, bodyColumns: 150, scroll: { offset: 0, bodyRows: 19 }, view: {} },
} as const

test('five presses at once send one prompt', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', ($, e) => {
    sent.push(e.text)
    return { text: e.text }
  })
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  const clock = mock.clock(on)
  const ui = await $.ui.mount({ plugin: 'trilemma', surface: 'desktop', ...BAND })
  await Promise.all([1, 2, 3, 4, 5].map(() => ui.press({ key: 'item-7' }).catch(() => undefined)))
  await clock.settle()
  expect(sent).toEqual(["What's your opinion?"])
})
