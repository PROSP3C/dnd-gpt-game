import * as fs from 'node:fs'

export class SaveManager {
  private readonly filepath = './save.json'
  private data: any

  async initialize() {
    try {
      fs.existsSync(this.filepath)
    } catch (error) {
      fs.promises.writeFile(this.filepath, JSON.stringify({}))
    }
  }

  async load() {
    try {
      const rawData = await fs.promises.readFile(this.filepath)
      const jsonData = rawData.toJSON()

      console.log(jsonData)

      this.data = jsonData
    } catch (error) {
      console.error('Error whilst loading:', error)
    }
  }

  async save() {
    try {
      await fs.promises.writeFile(this.filepath, JSON.stringify(this.data))
    } catch (error) {
      console.error('Error whilst saving:', error)
    }
  }
}
