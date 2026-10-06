import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTeam } from '../api/teams'
import { getLeague } from '../api/leagues'
import LoadingSpinner from '../components/LoadingSpinner'
import { initials } from '../utils/format'

export default function TeamDetailPage() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [league, setLeague] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const teamData = await getTeam(id)
        if (cancelled) return
        setTeam(teamData)
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
            <img src={team.logo} alt={team.name}
              style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'contain',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
          ) : (
            <div className="entity-logo-placeholder" style={{ width: 72, height: 72, fontSize: '1.25rem' }}>
              {initials(team.name)}
            </div>
          )}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{team.name}</h1>
          {team.short_name && <p style={{ color: 'var(--text-muted)' }}>{team.short_name}</p>}
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center',
          gap: '2rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
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
        </div>
      </div>
    </div>
  )
}
