import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getPlayer } from '../api/players'
import LoadingSpinner from '../components/LoadingSpinner'
import { initials } from '../utils/format'

export default function PlayerDetailPage() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPlayer(id)
        if (!cancelled) setPlayer(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <LoadingSpinner message="Loading player…" />
  if (error || !player) {
    return (
      <div>
        <Link to="/players" className="back-link"><ArrowLeft size={16} /> Back to players</Link>
        <div className="error-banner">{error || 'Player not found'}</div>
      </div>
    )
  }

  const stats = player.recent_stats || []

  return (
    <div>
      <Link to="/players" className="back-link"><ArrowLeft size={16} /> Back to players</Link>
      <div className="detail-header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {player.photo ? (
            <img src={player.photo} alt={player.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
          ) : (
            <div className="entity-logo-placeholder" style={{ width: 80, height: 80, fontSize: '1.4rem', borderRadius: '50%' }}>{initials(player.name)}</div>
          )}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {player.shirt_number != null && <span style={{ color: 'var(--accent)', marginRight: 8 }}>#{player.shirt_number}</span>}
            {player.name}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{player.position || '—'}{player.nationality && ` · ${player.nationality}`}</p>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {player.team && (
            <div>
              <div className="section-title" style={{ marginBottom: 2 }}>Team</div>
              <Link to={`/teams/${player.team.id}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>{player.team.name}</Link>
            </div>
          )}
        </div>
      </div>
      <div className="section-title">Recent match stats</div>
      {stats.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem' }}><p>No match statistics recorded yet.</p></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="player-stats-table">
            <thead>
              <tr>
                <th>Match</th><th>Min</th><th>G</th><th>A</th><th>Shots</th><th>Pass%</th><th>Tkl</th><th>YC</th><th>RC</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link to={`/matches/${s.match_id}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>#{s.match_id}</Link>
                    {s.started && <span style={{ color: 'var(--text-dim)', marginLeft: 6, fontSize: '0.7rem' }}>XI</span>}
                  </td>
                  <td>{s.minutes_played ?? '–'}</td>
                  <td>{s.goals ?? 0}</td>
                  <td>{s.assists ?? 0}</td>
                  <td>{s.shots ?? 0}{s.shots_on_target != null && <span style={{ color: 'var(--text-dim)' }}> ({s.shots_on_target})</span>}</td>
                  <td>{s.pass_accuracy != null ? `${Math.round(s.pass_accuracy)}%` : '–'}</td>
                  <td>{s.tackles ?? 0}</td>
                  <td>{s.yellow_cards ?? 0}</td>
                  <td>{s.red_cards ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
