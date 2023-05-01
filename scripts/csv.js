import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as url from 'node:url'
import ExifReader from 'exifreader'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageDir = path.join(__dirname, '..', 'public', 'images')

const header = ['filename', 'timestamp'].join('\t')
const filenames = await fs.readdir(imageDir)
const data = await Promise.all(
  filenames.map(async (filename) => {
    const tags = await ExifReader.load(path.join(imageDir, filename))
    const [date, time] = tags['DateTimeOriginal'].description.split(' ')
    const offset = tags['OffsetTimeOriginal'].description
    const timestamp = date.replaceAll(':', '-') + 'T' + time + offset
    return [filename, timestamp].join('\t')
  })
)

const output = [header, ...data].join('\n')

await fs.writeFile('data.csv', output)
