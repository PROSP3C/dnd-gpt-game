import 'dotenv/config'
import { error, log, style } from './utils.js'
import { setup } from './setup.js'
import { Select } from './select-options.js'
import { createSpinner } from './loading-spinner.js'
import { authenticate } from './authentication.js'

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

const createResponse = async (input: string) => {
  let response = ''

  try {
    setLoadingState(false)

    const { output_text, id } = await ai.responses.create({
      model: 'gpt-5-nano',
      input,
      previous_response_id: previousResponseId,
      store: true,
    })

    response = output_text
    previousResponseId = id

    setLoadingState(false)
  } catch (err: any) {
    error(style.red('Problem with responses api:'), err)
    quit()
  }

  return { response }
}

rl.on('SIGINT', () => {
  quit('Goodbye! <3')
})

const askLoop = async (): Promise<void> => {
  try {
    const userInput = await rl.question(style.prompt('Ask a question:'))

    const { response } = await createResponse(userInput)

    console.clear()
    log(style.response(response))

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

  const PreAuthMainMenu = new Select({
    question: 'Welcome!',
    options: ['LOGIN', 'QUIT'],
    answers: ['LOGIN', 'QUIT'],
  })

  const { value: preAuthSelection } = await PreAuthMainMenu.start()

  if (!preAuthSelection || preAuthSelection === 'QUIT') {
    quit('Goodbye! <3')
  }

  console.clear()
  const username = await rl.question(style.prompt('Username:'))
  console.clear()
  const password = await rl.question(style.prompt('Password:'))
  console.clear()

  const {
    user: { name },
  } = await authenticate(username, password)

  const PostAuthMainMenu = new Select({
    question: `Welcome Back, ${name}.`,
    options: ['NEW GAME', 'QUIT'],
    answers: ['NEW GAME', 'QUIT'],
  })

  const { value: postAuthSelection } = await PostAuthMainMenu.start()

  if (!postAuthSelection || postAuthSelection === 'QUIT') {
    quit('Goodbye! <3')
  }

  await askLoop()
})()
