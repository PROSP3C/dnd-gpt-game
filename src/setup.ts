import OpenAI from 'openai'
import * as readline from 'node:readline/promises'
import type { SetupResponse } from './types.js'
import { style } from './utils.js'

const setup = function (): SetupResponse {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(style.red('OPENAI_API_KEY not found.'))
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return { rl, client }
}

export { setup }
