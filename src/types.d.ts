import OpenAI from 'openai'
import * as readline from 'node:readline/promises'

export interface SetupResponse {
  rl: readline.Interface
  ai: OpenAI
}

export type SidedDice = 4 | 6 | 8 | 10 | 12 | 20

export type RollDiceOptions = {
  withAdvantage?: boolean
  withDisadvantage?: boolean
}

export enum GameState {
  GameMenu = 'GameMenu',
  DMsTurn = 'DMsTurn',
  PlayersTurn = 'PlayersTurn',
  Inventory = 'Inventory',
}
