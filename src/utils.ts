import chalk from 'chalk'

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

export { log, error, style }
