import OpenAI from 'openai'
import * as readline from 'node:readline/promises'
import type { SetupResponse } from './types.js'

const setup = function (): SetupResponse {
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
