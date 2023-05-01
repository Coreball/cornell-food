import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as url from 'node:url'
import dayjs from 'dayjs'
import ExifReader from 'exifreader'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const imageDir = path.join(__dirname, '..', 'public', 'images')

const filenames = await fs.readdir(imageDir)
const data = await Promise.all(
  filenames.map(async (filename) => {
    const tags = await ExifReader.load(path.join(imageDir, filename))
    const [date, time] = tags['DateTimeOriginal'].description.split(' ')
    const offset = tags['OffsetTimeOriginal'].description
    const timestamp = date.replaceAll(':', '-') + 'T' + time + offset
    return {
      filename,
      timestamp,
    }
  })
)

const extractSemester = (entry) => {
  const timestamp = dayjs(entry.timestamp)
  return `${timestamp.month() < 6 ? 'Spring' : 'Fall'} ${timestamp.year()}`
}

const semesters = [...new Set(data.map(extractSemester))]
const grouped = semesters.map((semester) => ({
  semester,
  data: data.filter((entry) => extractSemester(entry) === semester),
}))

await fs.writeFile('data.json', JSON.stringify(grouped, null, 2))
