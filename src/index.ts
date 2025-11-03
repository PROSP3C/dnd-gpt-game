import 'dotenv/config'
import { error, log, style } from './utils.js'
import { setup } from './setup.js'

const { ai, rl } = setup()

let previousResponseId: string | null = null

rl.on('SIGINT', () => {
  log(style.red('\nGoodbye! <3'))
  rl.close()
  process.exit(0)
})

const askLoop = async (): Promise<void> => {
  try {
    const userInput = await rl.question(style.prompt('Ask a question:'))

    const { output_text, id } = await ai.responses.create({
      model: 'gpt-5-nano',
      input: userInput,
      previous_response_id: previousResponseId,
      store: true,
    })

    log(style.response(output_text))

    previousResponseId = id

    await askLoop()
  } catch (err: any) {
    if (err.name === 'AbortError') {
      log(style.red('\nSession aborted.'))
    } else {
      error(style.red('\nUnexpected error:'), err)
    }
    rl.close()
    process.exit(1)
  }
}

log(style.green('Hello!'))

await askLoop()
