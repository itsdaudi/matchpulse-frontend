import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Search } from 'lucide-react'
import { getPlayers } from '../api/players'
import { getTeams } from '../api/teams'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { initials } from '../utils/format'

const POSITIONS = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export default function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState('All')
  const [teamFilter, setTeamFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [playerData, teamData] = await Promise.all([getPlayers(), getTeams()])
        if (!cancelled) { setPlayers(playerData); setTeams(teamData) }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let list = [...players]
    if (position !== 'All') {
      list = list.filter((p) => (p.position || '').toLowerCase() === position.toLowerCase())
    }
    if (teamFilter !== 'all') {
      list = list.filter((p) => String(p.team_id) === String(teamFilter))
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.nationality?.toLowerCase().includes(q) ||
          p.team?.name?.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [players, position, teamFilter, search])

  if (loading) return <LoadingSpinner message="Loading players…" />

  return (
    <div>
      <div className="page-header">
        <h1>Players</h1>
        <p>Squad members across all teams</p>
      </div>
      {error && <div className="error-banner">Could not load players: {error}</div>}
      <div className="filter-row" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 999, padding: '0.35rem 0.85rem', flex: '1 1 180px', maxWidth: 280 }}>
          <Search size={14} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <input type="search" placeholder="Search name, nationality…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }} />
        </div>
        <select className="filter-chip" value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} style={{ cursor: 'pointer', appearance: 'auto' }}>
          <option value="all">All teams</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="filter-row">
        {POSITIONS.map((pos) => (
          <button key={pos} type="button" className={`filter-chip${position === pos ? ' active' : ''}`} onClick={() => setPosition(pos)}>{pos}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={40} strokeWidth={1.5} />} title="No players found"
          description={error ? 'Check backend + seed data.' : 'Try a different search or filter.'} />
      ) : (
        <div className="card-grid">
          {filtered.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`} className="entity-card">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="entity-logo" style={{ borderRadius: '50%' }} />
              ) : (
                <div className="entity-logo-placeholder" style={{ borderRadius: '50%' }}>{initials(player.name)}</div>
              )}
              <div className="entity-info">
                <h3>
                  {player.shirt_number != null && <span style={{ color: 'var(--text-dim)', marginRight: 6, fontWeight: 600 }}>#{player.shirt_number}</span>}
                  {player.name}
                </h3>
                <p>{player.position || '—'}{player.team?.name && ` · ${player.team.name}`}{player.nationality && ` · ${player.nationality}`}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
