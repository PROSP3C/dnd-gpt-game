export const createSpinner = (
  frames = ['|', '/', '-', '\\'],
  interval = 80,
) => {
  let timer: NodeJS.Timeout | null = null
  let i = 0

  const start = (prefix = '') => {
    console.clear()

    if (!process.stdout.isTTY) return
    if (timer) return

    timer = setInterval(() => {
      const frame = frames[i % frames.length]
      process.stdout.write(`\r${prefix}${frame}`)
      i++
    }, interval)
  }

  const stop = (finalText?: string) => {
    if (!process.stdout.isTTY) return
    if (timer) {
      clearInterval(timer)
      timer = null
    }

    process.stdout.write('\r')
    if (finalText) process.stdout.write(finalText)
    process.stdout.write('\n')
  }

  return { start, stop }
}
