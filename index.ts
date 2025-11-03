import 'dotenv/config'
import chalk from 'chalk'
import OpenAI from 'openai'
import * as readline from 'node:readline/promises'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const log = console.log
const error = console.error

const style = {
  blue: (text: string) => chalk.blue(text),
  yellow: (text: string) => chalk.yellow(text),
  green: (text: string) => chalk.green(text),
  red: (text: string) => chalk.red(text),
  prompt: (text: string) => style.blue(`\n${text}\n\n`),
  response: (text: string) => style.yellow(`\n${text}`),
}

rl.on('SIGINT', () => {
  log(style.red('\nGoodbye! <3'))
  rl.close()
  process.exit(0)
})

const askLoop = async (): Promise<void> => {
  try {
    const userInput = await rl.question(style.prompt('Ask a question:'))

    const { output_text } = await client.responses.create({
      model: 'gpt-5-mini',
      input: userInput,
    })

    log(style.response(output_text))

    await askLoop()
  } catch (err: any) {
    if (err.name === 'AbortError') {
      log(chalk.red('\nSession aborted.'))
    } else {
      error(chalk.red('\nUnexpected error:'), err)
    }
    rl.close()
    process.exit(1)
  }
}

log(style.green('Hello!'))

await askLoop()
