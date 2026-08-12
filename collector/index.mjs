import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const outputPath = resolve('public/data/latest.json')
const apiBase = (process.env.MM_UPSTREAM_API_BASE ?? '').replace(/\/+$/, '')
const approvedJsonEndpoint = process.env.MM_AUTHORIZED_UPSTREAM_URL
const partyCsvUrl = process.env.MM_LEGEND_LEAGUE_CSV_URL
const region = (process.env.MM_REGION ?? 'jp').toLowerCase()

const headers = { Accept: 'application/json' }
if (process.env.MM_UPSTREAM_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.MM_UPSTREAM_BEARER_TOKEN}`

async function requestJson(url) {
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`Upstream request failed: ${response.status} ${response.statusText} (${url})`)
  return response.json()
}

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { pushField(); rows.push(row); row = [] }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const next = text[index + 1]
    if (character === '"') {
      if (quoted && next === '"') { field += '"'; index += 1 } else quoted = !quoted
    } else if (character === ',' && !quoted) {
      pushField()
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1
      pushRow()
    } else {
      field += character
    }
  }
  if (field !== '' || row.length > 0) pushRow()
  return rows
}

function parsePartyCell(value) {
  const text = value.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return null
  const level = text.match(/\bLv\.?\s*(\d+)/iu)?.[1]
  const withoutLevel = text.replace(/\s+Lv\.?\s*\d+.*$/iu, '').trim()
  const attributeMatch = withoutLevel.match(/\s+(藍|紅|翠|黄|天|冥)$/u)
  return {
    name: (attributeMatch ? withoutLevel.slice(0, attributeMatch.index) : withoutLevel).trim(),
    attribute: attributeMatch?.[1] ?? null,
    level: level ? Number(level) : null,
  }
}

async function loadPartyIndex() {
  if (!partyCsvUrl) return new Map()
  const response = await fetch(partyCsvUrl)
  if (!response.ok) throw new Error(`Legend League CSV request failed: ${response.status} ${response.statusText}`)
  const index = new Map()
  for (const row of parseCsv(await response.text()).slice(1)) {
    const world = row[1]?.trim()
    const name = row[2]?.trim()
    if (!world || !name) continue
    const party = row.slice(12, 17).map(parsePartyCell).filter(Boolean)
    if (party.length > 0) index.set(`${world}|${name}`, party)
  }
  return index
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let cursor = 0
  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

function buildFromApi({ groupsPayload, worldsPayload, worldPayloads, partyIndex }) {
  const worldRows = (worldsPayload?.data ?? []).filter((world) => world?.server === region && world?.ranking !== false).sort((a, b) => a.world_id - b.world_id)
  const validWorldIds = new Set(worldRows.map((world) => world.world_id))
  const worldById = new Map(worldRows.map((world) => [world.world_id, world]))
  const groupRows = (groupsPayload?.data ?? [])
    .map((group) => ({ ...group, worlds: (group.worlds ?? []).filter((worldId) => validWorldIds.has(worldId)) }))
    .filter((group) => group.worlds.length > 0)
    .sort((left, right) => Math.min(...left.worlds) - Math.min(...right.worlds))
  const worldDataById = new Map(worldPayloads.filter(Boolean).map((item) => [item.worldId, item]))

  const groups = groupRows.map((groupRow) => {
    const candidates = groupRow.worlds.flatMap((worldId) => {
      const worldData = worldDataById.get(worldId)
      return (worldData?.guildRanking ?? []).map((guild) => ({ ...guild, worldId }))
    }).sort((a, b) => b.bp - a.bp).slice(0, 48).map((guild, index) => ({ ...guild, rank: index + 1 }))
    const guildsByWorld = new Map()

    for (const guild of candidates) {
      const worldData = worldDataById.get(guild.worldId)
      const members = (worldData?.membersByGuild.get(String(guild.id)) ?? []).sort((a, b) => b.bp - a.bp).map((member, index) => {
        const server = worldById.get(guild.worldId)?.server ?? region
        const worldNumber = guild.worldId % 1000
        return {
          rank: index + 1,
          name: member.name,
          power: member.bp,
          role: member.guild_position === 1 ? 'ギルドマスター' : 'ギルド',
          status: 'unknown',
          party: partyIndex.get(`${server}${worldNumber}|${member.name}`) ?? null,
        }
      })
      const list = guildsByWorld.get(guild.worldId) ?? []
      list.push({ id: `${guild.worldId}-${guild.id}`, name: guild.name, rank: guild.rank, power: guild.bp, members })
      guildsByWorld.set(guild.worldId, list)
    }

    return {
      id: `group-${groupRow.group_id}`,
      label: `グループ ${groupRow.group_id}`,
      worlds: groupRow.worlds.map((worldId) => ({ id: `world-${worldId}`, label: `W${worldId % 1000}`, guilds: (guildsByWorld.get(worldId) ?? []).sort((a, b) => a.rank - b.rank) })),
    }
  })
  return groups.filter((group) => group.worlds.some((world) => world.guilds.length > 0))
}

async function collectApiData() {
  if (!apiBase) return null
  const [groupsPayload, worldsPayload, partyIndex] = await Promise.all([
    requestJson(`${apiBase}/wgroups`),
    requestJson(`${apiBase}/worlds`),
    loadPartyIndex(),
  ])
  const worlds = (worldsPayload?.data ?? []).filter((world) => world?.server === region && world?.ranking !== false).sort((a, b) => a.world_id - b.world_id)
  const worldPayloads = await mapWithConcurrency(worlds, 8, async (world) => {
    try {
      const [guildPayload, playerPayload] = await Promise.all([
        requestJson(`${apiBase}/${world.world_id}/guild_ranking/latest`),
        requestJson(`${apiBase}/${world.world_id}/player_ranking/latest`),
      ])
      const ranking = guildPayload?.data?.rankings?.bp ?? []
      const info = playerPayload?.data?.player_info ?? {}
      const membersByGuild = new Map()
      for (const player of playerPayload?.data?.rankings?.bp ?? []) {
        const member = { ...player, ...(info[player.id] ?? {}) }
        if (!member.guild_id) continue
        const members = membersByGuild.get(String(member.guild_id)) ?? []
        members.push(member)
        membersByGuild.set(String(member.guild_id), members)
      }
      return { worldId: world.world_id, guildRanking: ranking, membersByGuild }
    } catch (error) {
      console.warn(`Skipping world ${world.world_id}: ${error.message}`)
      return null
    }
  })
  const groups = buildFromApi({ groupsPayload, worldsPayload, worldPayloads, partyIndex })
  if (groups.length === 0) throw new Error('Upstream API returned no valid JP groups.')
  return { source: 'authorized-upstream-api', groups }
}

async function collectJsonEndpoint() {
  if (!approvedJsonEndpoint) return null
  const payload = await requestJson(approvedJsonEndpoint)
  const groups = payload?.groups ?? payload?.data?.groups
  if (!Array.isArray(groups)) throw new Error('Upstream payload must contain a groups array at the top level or under data.groups.')
  const validGroups = groups.filter((group) => group && typeof group.id === 'string' && Array.isArray(group.worlds))
  if (validGroups.length === 0) throw new Error('Upstream payload contained no valid groups.')
  return { source: 'authorized-upstream-json', groups: validGroups }
}

const collected = await collectApiData() ?? await collectJsonEndpoint()
if (!collected) throw new Error('Configure MM_UPSTREAM_API_BASE or MM_AUTHORIZED_UPSTREAM_URL before collecting.')

const output = { schemaVersion: 1, source: collected.source, updatedAt: new Date().toISOString(), groups: collected.groups }
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Wrote ${output.groups.length} groups to ${outputPath}`)
