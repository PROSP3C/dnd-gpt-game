import OpenAI from 'openai'
import * as readline from 'node:readline/promises'

export interface SetupResponse {
  rl: readline.Interface
  ai: OpenAI
}

export type DiceRoll = 4 | 6 | 8 | 10 | 12 | 20
