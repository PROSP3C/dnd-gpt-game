import 'dotenv/config'
import { error, log, style } from './utils.js'
import { setup } from './setup.js'
import { Select } from './select-options.js'
import { createSpinner } from './loading-spinner.js'

const { ai, rl } = setup()
const spinner = createSpinner()

let previousResponseId: string | null = null

const quit = (message?: string) => {
  setLoadingState(false)
  console.clear()
  log(style.red(message || ''))
  rl.close()
  process.exit(0)
}

const setLoadingState = (isLoading: boolean) => {
  if (isLoading) {
    spinner.start()
  } else {
    spinner.stop()
  }
}

rl.on('SIGINT', () => {
  quit('Goodbye! <3')
})

const askLoop = async (): Promise<void> => {
  try {
    const userInput = await rl.question(style.prompt('Ask a question:'))

    let message = ''

    try {
      setLoadingState(true)

      const { output_text, id } = await ai.responses.create({
        model: 'gpt-5-nano',
        input: userInput,
        previous_response_id: previousResponseId,
        store: true,
      })

      setLoadingState(false)

      previousResponseId = id
      message = `${output_text}\n`
    } catch (err: any) {
      error(style.red('Problem with responses api:'), err)
      quit()
    }

    console.clear()
    log(style.response(message))

    await askLoop()
  } catch (err: any) {
    if (err.name === 'AbortError') {
      log(style.red('Session aborted.'))
    } else {
      error(style.red('Unexpected error:'), err)
    }

    quit()
  }
}

;(async () => {
  console.clear()

  const MainMenu = new Select({
    question: 'Welcome!',
    options: ['NEW GAME', 'QUIT'],
    answers: ['NEW GAME', 'QUIT'],
  })

  const { value } = await MainMenu.start()

  if (!value || value === 'QUIT') {
    quit('Goodbye! <3')
  }

  console.clear()

  await askLoop()
})()
