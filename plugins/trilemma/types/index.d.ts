export type TrilemmaLimit = { kind: string; percentUsed: number; resetsAt?: string }

export type TrilemmaUsage = {
  costUsd?: number
  contextTokens?: number
  contextWindow: number
  limits: TrilemmaLimit[]
}

/** One reading of a rate-limit window, for the burn estimate. */
export type TrilemmaSample = { at: number; kind: string; percentUsed: number }

declare module 'claude-code' {
  interface PluginState {
    trilemma: {
      suggestions: string[]
      focus: number
      isDraft: boolean
      isSent: boolean
      usage: TrilemmaUsage | null
      lastTokens: number | null
      samples: TrilemmaSample[]
      tick: number
    }
  }
}
