import chalk from 'chalk'
import type { SidedDice, RollDiceOptions } from './types.js'

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

const rollDice = function (
  sides: SidedDice,
  count = 1,
  options: RollDiceOptions = {},
): number {
  const { withAdvantage = false, withDisadvantage = false } = options
  const rollCount = withAdvantage || withDisadvantage ? 2 : count
  const rolls: number[] = []

  for (let d = 0; d < rollCount; d++) {
    rolls.push(Math.floor(Math.random() * sides) + 1)
  }

  if (withAdvantage) {
    return Math.max(...rolls)
  }

  if (withDisadvantage) {
    return Math.min(...rolls)
  }

  return rolls.reduce((acc, val) => acc + val, 0)
}

export { log, error, style, rollDice }
