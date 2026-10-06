import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTeam, getTeamPlayers } from '../api/teams'
import { getLeague } from '../api/leagues'
import LoadingSpinner from '../components/LoadingSpinner'
import { initials } from '../utils/format'

const POSITION_ORDER = { goalkeeper: 0, defender: 1, midfielder: 2, forward: 3 }

export default function TeamDetailPage() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [league, setLeague] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [teamData, squadData] = await Promise.all([getTeam(id), getTeamPlayers(id)])
        if (cancelled) return
        setTeam(teamData)
        setPlayers(squadData.players || [])
        if (teamData.league_id) {
          try {
            const leagueData = await getLeague(teamData.league_id)
            if (!cancelled) setLeague(leagueData)
          } catch { /* optional */ }
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const grouped = useMemo(() => {
    const groups = {}
    const sorted = [...players].sort((a, b) => {
      const pa = POSITION_ORDER[(a.position || '').toLowerCase()] ?? 9
      const pb = POSITION_ORDER[(b.position || '').toLowerCase()] ?? 9
      if (pa !== pb) return pa - pb
      return (a.shirt_number ?? 99) - (b.shirt_number ?? 99)
    })
    sorted.forEach((p) => {
      const key = p.position || 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(p)
    })
    return groups
  }, [players])

  if (loading) return <LoadingSpinner message="Loading team…" />
  if (error || !team) {
    return (
      <div>
        <Link to="/teams" className="back-link"><ArrowLeft size={16} /> Back to teams</Link>
        <div className="error-banner">{error || 'Team not found'}</div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/teams" className="back-link"><ArrowLeft size={16} /> Back to teams</Link>
      <div className="detail-header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {team.logo ? (
            <img src={team.logo} alt={team.name} style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'contain', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
          ) : (
            <div className="entity-logo-placeholder" style={{ width: 72, height: 72, fontSize: '1.25rem' }}>{initials(team.name)}</div>
          )}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{team.name}</h1>
          {team.short_name && <p style={{ color: 'var(--text-muted)' }}>{team.short_name}</p>}
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {league && (
            <div>
              <div className="section-title" style={{ marginBottom: 2 }}>League</div>
              <div style={{ color: 'var(--text)', fontWeight: 600 }}>{league.name}</div>
            </div>
          )}
          {team.stadium && (
            <div>
              <div className="section-title" style={{ marginBottom: 2 }}>Stadium</div>
              <div style={{ color: 'var(--text)', fontWeight: 600 }}>{team.stadium}</div>
            </div>
          )}
          <div>
            <div className="section-title" style={{ marginBottom: 2 }}>Squad</div>
            <div style={{ color: 'var(--text)', fontWeight: 600 }}>{players.length} player{players.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
      <div className="section-title">Squad</div>
      {players.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem' }}>
          <p>No players in this squad yet. Run python seed.py or add players via the API.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([pos, list]) => (
          <div key={pos} style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">{pos}</div>
            <div className="card-grid">
              {list.map((player) => (
                <Link key={player.id} to={`/players/${player.id}`} className="entity-card">
                  {player.photo ? (
                    <img src={player.photo} alt={player.name} className="entity-logo" style={{ borderRadius: '50%' }} />
                  ) : (
                    <div className="entity-logo-placeholder" style={{ borderRadius: '50%' }}>{initials(player.name)}</div>
                  )}
                  <div className="entity-info">
                    <h3>
                      {player.shirt_number != null && <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>#{player.shirt_number}</span>}
                      {player.name}
                    </h3>
                    <p>{player.nationality || player.position || '—'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
