import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { getTeams } from '../api/teams'
import { getLeagues } from '../api/leagues'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { initials } from '../utils/format'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [teamData, leagueData] = await Promise.all([getTeams(), getLeagues()])
        if (!cancelled) { setTeams(teamData); setLeagues(leagueData) }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const leagueMap = useMemo(() => {
    const map = {}
    leagues.forEach((l) => { map[l.id] = l })
    return map
  }, [leagues])

  if (loading) return <LoadingSpinner message="Loading teams…" />

  return (
    <div>
      <div className="page-header">
        <h1>Teams</h1>
        <p>Clubs and national sides</p>
      </div>
      {error && <div className="error-banner">Could not load teams: {error}</div>}
      {teams.length === 0 ? (
        <EmptyState icon={<Shield size={40} strokeWidth={1.5} />}
          title="No teams yet"
          description="Create teams via the backend API to see them here." />
      ) : (
        <div className="card-grid">
          {teams.map((team) => (
            <Link key={team.id} to={`/teams/${team.id}`} className="entity-card">
              {team.logo
                ? <img src={team.logo} alt={team.name} className="entity-logo" />
                : <div className="entity-logo-placeholder">{initials(team.name)}</div>}
              <div className="entity-info">
                <h3>{team.name}</h3>
                <p>
                  {team.short_name && `${team.short_name} · `}
                  {leagueMap[team.league_id]?.name || team.stadium || '—'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
