import * as fs from 'node:fs'

export class SaveManager {
  private readonly filepath = './save.json'
  private data: any

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

  async load(): Promise<any> {
    try {
      const rawData = await fs.promises.readFile(this.filepath)
      const jsonData = rawData.toJSON()

      this.data = jsonData

      return this.data
    } catch (error) {
      console.error('Error whilst loading:', error)
    }
  }

  async save(data: any): Promise<void> {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(data))
    } catch (error) {
      console.error('Error whilst saving:', error)
    }
  }
}
