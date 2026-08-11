import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const endpoint = process.env.MM_AUTHORIZED_UPSTREAM_URL
const bearerToken = process.env.MM_UPSTREAM_BEARER_TOKEN
const outputPath = resolve('public/data/latest.json')

if (!endpoint) {
  throw new Error('MM_AUTHORIZED_UPSTREAM_URL is not configured. Set the operator-approved upstream JSON endpoint before collecting.')
}

const headers = { Accept: 'application/json' }
if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`

const response = await fetch(endpoint, { headers })
if (!response.ok) {
  throw new Error(`Upstream request failed: ${response.status} ${response.statusText}`)
}

const payload = await response.json()
const groups = payload?.groups ?? payload?.data?.groups

if (!Array.isArray(groups)) {
  throw new Error('Upstream payload must contain a groups array at the top level or under data.groups.')
}

const validGroups = groups.filter((group) => group && typeof group.id === 'string' && Array.isArray(group.worlds))
if (validGroups.length === 0) {
  throw new Error('Upstream payload contained no valid groups.')
}

const output = {
  schemaVersion: 1,
  source: 'authorized-upstream',
  updatedAt: new Date().toISOString(),
  groups: validGroups,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Wrote ${validGroups.length} groups to ${outputPath}`)
