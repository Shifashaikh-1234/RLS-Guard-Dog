import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const envTestPath = resolve(root, '.env.test')
const envLocalPath = resolve(root, '.env.local')

if (existsSync(envTestPath)) {
  config({ path: envTestPath, override: true })
}
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath, override: false })
}

config()