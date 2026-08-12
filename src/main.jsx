import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

// This adapter is intentionally separate from the UI. The official upstream
// endpoints require an authenticated game session; no credentials belong in
// this static frontend. Replace this demo provider with an authorized,
// server-side collector when access has been approved.
const demoGroups = [
  {
    id: 'g181',
    label: 'グループ 181',
    worlds: [
      {
        id: 'w165',
        label: 'W165',
        guilds: [
          {
            id: 'guild-astral',
            name: 'Astral Gate',
            rank: 3,
            power: 18420000,
            wins: 28,
            members: [
              { rank: 1, name: 'Luna', power: 1268000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Serein', power: 1142000, role: 'サブマスター', status: 'online' },
              { rank: 3, name: 'Nox', power: 1087000, role: 'メンバー', status: 'away' },
              { rank: 4, name: 'Aster', power: 1009000, role: 'メンバー', status: 'offline' },
              { rank: 5, name: 'Mira', power: 978000, role: 'メンバー', status: 'online' },
            ],
          },
          {
            id: 'guild-ember',
            name: 'Ember Union',
            rank: 7,
            power: 15280000,
            wins: 24,
            members: [
              { rank: 1, name: 'Rook', power: 1108000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Vega', power: 1026000, role: 'メンバー', status: 'away' },
              { rank: 3, name: 'Kite', power: 986000, role: 'メンバー', status: 'offline' },
            ],
          },
          {
            id: 'guild-lumen',
            name: 'Lumen Ark',
            rank: 11,
            power: 13140000,
            wins: 20,
            members: [
              { rank: 1, name: 'Iris', power: 998000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Ciel', power: 942000, role: 'メンバー', status: 'online' },
            ],
          },
          {
            id: 'guild-sable',
            name: 'Sable Circuit',
            rank: 21,
            power: 11480000,
            wins: 16,
            members: [
              { rank: 1, name: 'Sable', power: 876000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Owl', power: 821000, role: 'メンバー', status: 'away' },
            ],
          },
          {
            id: 'guild-aurora',
            name: 'Aurora Line',
            rank: 37,
            power: 9420000,
            wins: 12,
            members: [
              { rank: 1, name: 'Ari', power: 743000, role: 'ギルドマスター', status: 'offline' },
              { rank: 2, name: 'Lio', power: 702000, role: 'メンバー', status: 'online' },
            ],
          },
        ],
      },
      {
        id: 'w166',
        label: 'W166',
        guilds: [
          {
            id: 'guild-echo',
            name: 'Echo Bloom',
            rank: 5,
            power: 16020000,
            wins: 25,
            members: [
              { rank: 1, name: 'Aoi', power: 1170000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Ren', power: 1002000, role: 'メンバー', status: 'away' },
            ],
          },
          {
            id: 'guild-vale',
            name: 'Vale Order',
            rank: 15,
            power: 12050000,
            wins: 18,
            members: [
              { rank: 1, name: 'Sora', power: 950000, role: 'ギルドマスター', status: 'offline' },
            ],
          },
        ],
      },
      {
        id: 'w167',
        label: 'W167',
        guilds: [
          {
            id: 'guild-arc',
            name: 'Arc Harbor',
            rank: 9,
            power: 14080000,
            wins: 22,
            members: [
              { rank: 1, name: 'Fenn', power: 1045000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Yuki', power: 967000, role: 'メンバー', status: 'away' },
            ],
          },
        ],
      },
      {
        id: 'w168',
        label: 'W168',
        guilds: [
          {
            id: 'guild-dawn',
            name: 'Dawn Relay',
            rank: 13,
            power: 12760000,
            wins: 19,
            members: [
              { rank: 1, name: 'Haku', power: 991000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Rin', power: 903000, role: 'メンバー', status: 'offline' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'g182',
    label: 'グループ 182',
    worlds: [
      {
        id: 'w169',
        label: 'W169',
        guilds: [
          {
            id: 'guild-orbit',
            name: 'Orbit Nine',
            rank: 2,
            power: 19060000,
            wins: 31,
            members: [
              { rank: 1, name: 'Nova', power: 1320000, role: 'ギルドマスター', status: 'online' },
              { rank: 2, name: 'Sol', power: 1176000, role: 'メンバー', status: 'online' },
            ],
          },
        ],
      },
      {
        id: 'w170',
        label: 'W170',
        guilds: [
          {
            id: 'guild-lattice',
            name: 'Lattice Core',
            rank: 6,
            power: 16610000,
            wins: 26,
            members: [{ rank: 1, name: 'Mio', power: 1198000, role: 'ギルドマスター', status: 'online' }],
          },
        ],
      },
      {
        id: 'w171',
        label: 'W171',
        guilds: [
          {
            id: 'guild-rift',
            name: 'Rift House',
            rank: 10,
            power: 14290000,
            wins: 21,
            members: [{ rank: 1, name: 'Kai', power: 1063000, role: 'ギルドマスター', status: 'away' }],
          },
        ],
      },
      {
        id: 'w172',
        label: 'W172',
        guilds: [
          {
            id: 'guild-pulse',
            name: 'Pulse Garden',
            rank: 14,
            power: 12680000,
            wins: 17,
            members: [{ rank: 1, name: 'Towa', power: 982000, role: 'ギルドマスター', status: 'offline' }],
          },
        ],
      },
    ],
  },
]

const formatNumber = (value) => new Intl.NumberFormat('ja-JP').format(value)

const guildClasses = [
  { id: 'grand-master', label: 'グランドマスター', range: '1〜16位', min: 1, max: 16 },
  { id: 'expert', label: 'エキスパート', range: '17〜32位', min: 17, max: 32 },
  { id: 'elite', label: 'エリート', range: '33〜48位', min: 33, max: 48 },
]

// Prototype shape for the future upstream field: member.party = string[].
// The fallback keeps the UI demonstrable until the authorized collector adds it.
const partyPresets = [
  ['フローレンス', 'コルディ', 'ミミ', 'マーリン', 'プリシラ'],
  ['ルナリンド', 'フェンリル', 'マーリン', 'アモール', 'ナターシャ'],
  ['ソルティーナ', 'アモール', 'プリシラ', 'ハトホル', 'ディアン'],
  ['ハトホル', 'ナターシャ', 'ディアン', 'フローレンス', 'コルディ'],
]

const partyAttributeMeta = {
  藍: { label: '藍', className: 'blue' },
  紅: { label: '紅', className: 'red' },
  翠: { label: '翠', className: 'green' },
  黄: { label: '黄', className: 'yellow' },
  天: { label: '天', className: 'white' },
  冥: { label: '冥', className: 'purple' },
}

function Icon({ name, size = 20 }) {
  const paths = {
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    users: <><path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20" /><circle cx="9.5" cy="7" r="3.5" /><path d="M17 11a3 3 0 1 0-1-5.8M21 20v-1.6a3.4 3.4 0 0 0-2.5-3.3" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    chevron: <><path d="m6 9 6 6 6-6" /></>,
    crown: <><path d="m3 8 4 3 5-7 5 7 4-3-2 10H5L3 8Z" /><path d="M5 21h14" /></>,
    sword: <><path d="m14 5 5 5M4 20l6.5-6.5M13 6l5-3 2 2-3 5M11 8l5 5M4 4l6 6M3 21l3-1 1-3-3-3-3 3 2 2Z" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-14.7-3L3 11" /><path d="M3 5v6h6M4 13a8.1 8.1 0 0 0 14.7 3L21 13" /><path d="M21 19v-6h-6" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function App() {
  const demoMode = new URLSearchParams(window.location.search).get('demo') === '1'
  const initialGroups = demoMode ? demoGroups : []
  const [groups, setGroups] = useState(initialGroups)
  const [dataStatus, setDataStatus] = useState(demoMode ? 'demo' : 'pending')
  const [dataUpdatedAt, setDataUpdatedAt] = useState(null)
  const [worldId, setWorldId] = useState(initialGroups[0]?.worlds?.[0]?.id ?? '')
  const [classId, setClassId] = useState(guildClasses[0].id)
  const [memberQuery, setMemberQuery] = useState('')
  const [selectedGuildId, setSelectedGuildId] = useState(initialGroups[0]?.worlds?.[0]?.guilds?.[0]?.id ?? '')

  useEffect(() => {
    let active = true
    fetch(`${import.meta.env.BASE_URL}data/latest.json?ts=${Date.now()}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!active || !Array.isArray(payload?.groups) || payload.groups.length === 0) return
        const nextGroups = payload.groups
        const firstWorld = nextGroups[0]?.worlds?.[0]
        if (!firstWorld) return
        setGroups(nextGroups)
        setWorldId(firstWorld.id)
        setSelectedGuildId(firstWorld.guilds?.[0]?.id ?? '')
        setDataStatus('upstream')
        setDataUpdatedAt(payload.updatedAt ?? null)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const allWorlds = groups
    .flatMap((item) => item.worlds.map((worldItem) => ({ ...worldItem, groupLabel: item.label, groupId: item.id })))
    .sort((left, right) => Number(left.label.slice(1)) - Number(right.label.slice(1)))
  const selectedWorld = allWorlds.find((item) => item.id === worldId) ?? allWorlds[0] ?? null
  const group = selectedWorld ? groups.find((item) => item.id === selectedWorld.groupId) ?? groups[0] : null
  const world = group ? group.worlds.find((item) => item.id === worldId) ?? group.worlds[0] : null
  const guilds = world?.guilds ?? []
  const selectedClass = guildClasses.find((item) => item.id === classId) ?? guildClasses[0]
  const classGuilds = guilds.filter((guild) => guild.rank >= selectedClass.min && guild.rank <= selectedClass.max)
  const selectedGuild = classGuilds.find((guild) => guild.id === selectedGuildId) ?? classGuilds[0]
  const updatedLabel = dataUpdatedAt
    ? new Intl.DateTimeFormat('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(dataUpdatedAt))
    : 'サンプル'

  const filteredMembers = useMemo(() => {
    if (!selectedGuild) return []
    const normalized = memberQuery.trim().toLowerCase()
    if (!normalized) return selectedGuild.members
    return selectedGuild.members.filter((member) => member.name.toLowerCase().includes(normalized))
  }, [memberQuery, selectedGuild])

  const selectWorld = (nextWorldId) => {
    const nextWorld = allWorlds.find((item) => item.id === nextWorldId) ?? allWorlds[0]
    if (!nextWorld) return
    setWorldId(nextWorld.id)
    setClassId(guildClasses[0].id)
    setSelectedGuildId(nextWorld.guilds[0]?.id ?? '')
    setMemberQuery('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button menu-button" aria-label="メニュー"><Icon name="menu" /></button>
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="shield" size={24} /></div>
          <div>
            <p className="eyebrow">グランドバトル</p>
            <h1>グランドバトル用戦力分析</h1>
          </div>
        </div>
        <div className="topbar-meta"><div className="update-stamp"><span>最終更新</span><strong>{updatedLabel}</strong></div><div className="connection-pill"><span className="status-dot" /><span className="server-name">{dataStatus === 'upstream' ? 'JP / 上流データ' : dataStatus === 'demo' ? 'JP / サンプル表示' : 'JP / 接続待ち'}</span></div></div>
      </header>

      <main className="content">
        <section className="intro-row">
          <div>
            <p className="section-kicker">SEARCH CONSOLE <span>01</span></p>
            <h2>ギルド戦力</h2>
            <p className="muted">ワールドを選ぶと、紐づくグループと4つのワールドを表示します。</p>
          </div>
          <button className="ghost-button" onClick={() => window.location.reload()}><Icon name="refresh" size={16} />リセット</button>
        </section>

        <section className="selector-card" aria-label="検索条件">
          <div className="selector-step">
            <div className="step-label"><span className="step-number">01</span><span>ワールドを選択</span></div>
            <label className="select-wrap">
              <Icon name="globe" size={19} />
              <select value={worldId} onChange={(event) => selectWorld(event.target.value)} aria-label="ワールドを選択" disabled={allWorlds.length === 0}>
                {allWorlds.length > 0 ? allWorlds.map((item) => <option key={item.id} value={item.id}>{item.label}（{item.groupLabel}）</option>) : <option value="">上流データ接続待ち</option>}
              </select>
            </label>
          </div>
          <div className="selector-step">
            <div className="step-label"><span className="step-number">02</span><span>{group?.label ?? 'グループ未接続'} のワールド</span></div>
            <div className="group-worlds-note"><Icon name="users" size={17} /><span>{group ? '同じグループのワールドを選択' : '上流データ接続待ち'}</span><strong>{group ? `${group.worlds.length} worlds` : '—'}</strong></div>
            <div className="world-list" role="tablist" aria-label="グループ内ワールドを選択">
              {group ? group.worlds.map((item) => <button key={item.id} className={`world-chip ${item.id === world?.id ? 'active' : ''}`} onClick={() => selectWorld(item.id)} role="tab" aria-selected={item.id === world?.id}><Icon name="globe" size={16} />{item.label}</button>) : <span className="inline-waiting">上流データ接続待ち</span>}
            </div>
          </div>
        </section>

        <div className="workspace-grid">
          <section className="panel guild-panel">
            <div className="panel-heading"><div><p className="section-kicker">GUILDS <span>{world?.label ?? '—'}</span></p><h3>ギルド一覧</h3></div><span className="count-badge">{classGuilds.length} guilds</span></div>
            <div className="class-tabs" role="tablist" aria-label="ギルドクラス">
              {guildClasses.map((item) => <button key={item.id} className={`class-tab ${item.id === selectedClass.id ? 'active' : ''}`} onClick={() => setClassId(item.id)} role="tab" aria-selected={item.id === selectedClass.id}><span>{item.label}</span><small>{item.range}</small></button>)}
            </div>
            <div className="guild-list">
              {classGuilds.length === 0 && <div className="empty-state"><Icon name="search" size={28} /><strong>{dataStatus === 'pending' ? '上流データ接続待ち' : 'このクラスのギルドがありません'}</strong><span>{dataStatus === 'pending' ? '実際のワールドとギルドを接続すると表示されます。' : `${selectedClass.range}のデータを確認してください。`}</span></div>}
              {classGuilds.map((guild) => <button key={guild.id} className={`guild-card ${selectedGuild?.id === guild.id ? 'selected' : ''}`} onClick={() => { setSelectedGuildId(guild.id); setMemberQuery('') }}>
                <div className="guild-rank">{String(guild.rank).padStart(2, '0')}</div>
                <div className="guild-emblem"><Icon name="shield" size={23} /></div>
                <div className="guild-copy"><strong>{guild.name}</strong><span>ギルド戦力 {formatNumber(guild.power)}</span></div>
                <div className="guild-members"><Icon name="users" size={16} /><span>{guild.members.length}</span></div><Icon name="arrow" size={20} />
              </button>)}
            </div>
          </section>

          <section className="panel member-panel">
            {selectedGuild ? <>
              <div className="guild-detail-head"><div className="detail-title"><div className="guild-emblem large"><Icon name="shield" size={30} /></div><div><p className="section-kicker">SELECTED GUILD <span>RANK {selectedGuild.rank}</span></p><h3>{selectedGuild.name}</h3><span className="detail-meta">{group?.label ?? '—'} / {world?.label ?? '—'}</span></div></div><button className="outline-button"><Icon name="sword" size={16} />詳細</button></div>
              <div className="metric-row"><div><span>総合戦闘力</span><strong>{formatNumber(selectedGuild.power)}</strong></div><div><span>メンバー</span><strong>{selectedGuild.members.length}<small> 名</small></strong></div></div>
              <div className="members-heading"><div><p className="section-kicker">MEMBERS <span>{filteredMembers.length}/{selectedGuild.members.length}</span></p><h3 className="members-title">メンバー <span className="member-scope-note">全サーバーランキング1万位以内</span></h3></div><label className="mini-search"><Icon name="search" size={16} /><input value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} placeholder="メンバー検索" aria-label="メンバー検索" /></label></div>
              <div className="member-table-wrap"><div className="member-table-head"><span>#</span><span>PLAYER</span><span>戦力</span><span>レジェンドリーグ</span></div>{filteredMembers.map((member) => { const rawParty = member.party ?? partyPresets[(member.rank - 1) % partyPresets.length]; const party = rawParty.map((character) => { const value = typeof character === 'string' ? character : character?.name ?? character?.characterName ?? ''; const match = value.match(/^(.*)\s+(藍|紅|翠|黄|天|冥)$/); const attribute = typeof character === 'object' ? character?.attribute ?? character?.element : match?.[2]; return { name: match?.[1] ?? value, attribute: partyAttributeMeta[attribute] ? attribute : null } }); return <div className="member-row" key={member.name}><span className={`member-rank ${member.rank <= 3 ? 'top' : ''}`}>{String(member.rank).padStart(2, '0')}</span><div className="player-cell"><span className={`avatar status-${member.status}`}>{member.name.slice(0, 1)}</span><span><strong>{member.name}</strong><small>{member.role}</small></span></div><strong className="power-cell">{formatNumber(member.power)}</strong><span className="party-cell"><span className="party-icons">{party.slice(0, 5).map(({ name, attribute }, index) => <span className={`party-chip ${attribute ? `attribute-${partyAttributeMeta[attribute].className}` : 'attribute-unknown'}`} key={`${name}-${index}`} aria-label={`${name}${attribute ? `・${attribute}属性` : '・属性不明'}`} title={`${name}${attribute ? `・${attribute}属性` : '・属性不明'}`}>{attribute ? partyAttributeMeta[attribute].label : '?'}</span>)}</span></span></div> })}</div>
            </> : <div className="empty-state large-empty"><Icon name="shield" size={38} /><strong>{dataStatus === 'pending' ? '上流データ接続待ち' : 'ギルドを選択してください'}</strong><span>{dataStatus === 'pending' ? '実際のギルドデータを接続するとメンバーが表示されます。' : '一覧からギルドをタップするとメンバーが表示されます。'}</span></div>}
          </section>
        </div>

        <section className="data-note"><div className="note-icon"><Icon name="shield" size={18} /></div><div><strong>データ接続について</strong><p>{dataStatus === 'upstream' ? `運営確認済みの上流データを表示しています。${dataUpdatedAt ? `更新: ${new Date(dataUpdatedAt).toLocaleString('ja-JP')}` : ''}` : dataStatus === 'demo' ? '画面確認用のサンプル表示です。通常起動では実データ接続待ちとして表示します。' : '公式上流データの接続待ちです。接続後に実際のワールドとギルドのみ表示します。'}</p></div><span className="note-label">{dataStatus === 'upstream' ? 'UPSTREAM LIVE' : dataStatus === 'demo' ? 'DEMO MODE' : 'UPSTREAM PENDING'}</span></section>
      </main>
      <footer className="footer"><span>グランドバトル用戦力分析</span><span>JP / 日本サーバー</span></footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
