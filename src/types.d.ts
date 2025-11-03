import OpenAI from 'openai'
import * as readline from 'node:readline/promises'

export interface SetupResponse {
  rl: readline.Interface
  client: OpenAI
}
