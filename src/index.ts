import 'dotenv/config'
import { error, log, clear, style } from './utils.js'
import { setup } from './setup.js'
import { Select } from './select-options.js'
import { authenticate } from './authentication.js'

const { ai, rl, setLoadingState } = setup()

let previousResponseId: string | null = null

const quit = (message: string, err?: any) => {
  setLoadingState(false)
  clear()

  if (err) {
    error(style.red(message), err)
  } else {
    log(style.red(message))
  }

  rl.close()
  process.exit(0)
}

const getUserInput = async (question: string) => {
  clear()

  return await rl.question(style.prompt(question))
}

const createResponse = async (input: string) => {
  let response = ''

  try {
    clear()
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

    clear()
    log(style.response(response))
  } catch (err: any) {
    quit('Problem with responses api:', err)
  }

  return { response }
}

rl.on('SIGINT', () => {
  quit('Goodbye! <3')
})

const askLoop = async (): Promise<void> => {
  try {
    const userInput = await getUserInput('Ask a question:')
    await createResponse(userInput)

    await askLoop()
  } catch (err: any) {
    quit('Unexpected error:', err)
  }
}

;(async () => {
  clear()

  const PreAuthMainMenu = new Select({
    question: 'Welcome!',
    options: ['LOGIN', 'QUIT'],
    answers: ['LOGIN', 'QUIT'],
  })

  const { value: preAuthSelection } = await PreAuthMainMenu.start()

  if (!preAuthSelection || preAuthSelection === 'QUIT') {
    quit('Goodbye! <3')
  }

  const username = await getUserInput('Username:')
  const password = await getUserInput('Password:')

  const {
    user: { name },
  } = await authenticate(username, password)

  clear()

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
