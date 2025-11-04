import * as rl from 'readline'
import { style } from './utils.js'
const stdout = process.stdout
const stdin = process.stdin

type SelectOptions = {
  question: string
  options: string[]
  answers: string[]
  pointer?: string
  color?: string
}

export class Select {
  question: string
  options: string[]
  answers: string[]
  pointer: string
  color?: string
  input: number
  cursorLocs: { x: number; y: number }
  private handler?: (c: string) => void

  constructor(opts: SelectOptions) {
    const {
      question = '',
      options = [],
      answers = [],
      pointer = '>',
      color = 'blue',
    } = opts

    this.question = question
    this.options = options.slice()
    this.answers = answers
    this.pointer = pointer
    this.color = color
    this.input = 0
    this.cursorLocs = { x: 0, y: 1 }
  }

  private resolve?: (res: { index: number; value: string }) => void

  async start(): Promise<{ index: number; value: string }> {
    stdout.write(style.blue(this.question) + '\n')

    this.cursorLocs.y = 1
    this.input = 0

    for (let i = 0; i < this.options.length; i++) {
      const isSelected = i === this.input
      const line =
        (i === this.input ? this.pointer + ' ' : '  ') + this.options[i]
      stdout.write((isSelected ? style.yellow(line) : line) + '\n')
    }

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf-8')
    this.hideCursor()

    this.handler = this.pn(this)
    stdin.on('data', this.handler)

    return await new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  showCursor() {
    stdout.write('\x1B[?25h')
  }

  hideCursor() {
    stdout.write('\x1B[?25l')
  }

  private redrawLine(row: number, text: string, isSelected = false) {
    rl.cursorTo(stdout, 0, row)
    rl.clearLine(stdout, 0)
    const out = isSelected ? style.yellow(text) : text
    stdout.write(out)
  }

  upArrow() {
    const prevIndex = this.input
    this.input = (this.input - 1 + this.options.length) % this.options.length

    const prevRow = prevIndex + 1
    const newRow = this.input + 1

    this.redrawLine(prevRow, '  ' + this.options[prevIndex], false)
    this.redrawLine(newRow, this.pointer + ' ' + this.options[this.input], true)

    this.cursorLocs.y = newRow
  }

  downArrow() {
    const prevIndex = this.input
    this.input = (this.input + 1) % this.options.length

    const prevRow = prevIndex + 1
    const newRow = this.input + 1

    this.redrawLine(prevRow, '  ' + this.options[prevIndex], false)
    this.redrawLine(newRow, this.pointer + ' ' + this.options[this.input], true)

    this.cursorLocs.y = newRow
  }

  enter() {
    if (this.handler) {
      stdin.removeListener('data', this.handler)
    }

    stdin.setRawMode(false)
    stdin.pause()
    this.showCursor()
    rl.cursorTo(stdout, 0, this.options.length + 1)

    if (this.resolve) {
      this.resolve({ index: this.input, value: `${this.answers[this.input]}` })
    }
  }

  ctrlc() {
    if (this.handler) {
      stdin.removeListener('data', this.handler)
    }

    stdin.setRawMode(false)
    stdin.pause()
    this.showCursor()
  }

  pn(self: Select) {
    return (c: string) => {
      switch (c) {
        case '\u0004': // Ctrl-d
        case '\r':
        case '\n':
          return self.enter()
        case '\u0003': // Ctrl-c
          return self.ctrlc()
        case '\u001b[A': // up
          return self.upArrow()
        case '\u001b[B': // down
          return self.downArrow()
      }
    }
  }
}
