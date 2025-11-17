import * as fs from 'node:fs'

export class SaveManager {
  private readonly filepath = './save.json'
  private data = {}

  async initialize(): Promise<void> {
    try {
      fs.existsSync(this.filepath)
    } catch (error) {
      fs.promises.writeFile(
        this.filepath,
        JSON.stringify({
          characters: [],
        }),
      )
    }
  }

  async load(): Promise<void> {
    try {
      this.data = (await fs.promises.readFile(this.filepath)).toJSON()
    } catch (error) {
      console.error('Error whilst loading:', error)
    }
  }

  async save(data: any): Promise<void> {
    try {
      await fs.promises.writeFile(this.filepath, data)
    } catch (error) {
      console.error('Error whilst saving:', error)
    }
  }

  getLoadedData() {
    return this.data
  }
}
