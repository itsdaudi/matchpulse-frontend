import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { getLeagues } from '../api/leagues'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { initials } from '../utils/format'

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getLeagues()
        if (!cancelled) setLeagues(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <LoadingSpinner message="Loading leagues…" />

  return (
    <div>
      <div className="page-header">
        <h1>Leagues</h1>
        <p>Competitions in the system</p>
      </div>
      {error && <div className="error-banner">Could not load leagues: {error}</div>}
      {leagues.length === 0 ? (
        <EmptyState icon={<Trophy size={40} strokeWidth={1.5} />}
          title="No leagues yet"
          description="Create leagues via the backend API to see them here." />
      ) : (
        <div className="card-grid">
          {leagues.map((league) => (
            <div key={league.id} className="entity-card">
              {league.logo
                ? <img src={league.logo} alt={league.name} className="entity-logo" />
                : <div className="entity-logo-placeholder">{initials(league.name)}</div>}
              <div className="entity-info">
                <h3>{league.name}</h3>
                {league.country && <p>{league.country}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
