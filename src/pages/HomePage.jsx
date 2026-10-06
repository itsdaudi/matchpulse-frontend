import { useEffect, useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import { getMatches } from '../api/matches'
import { getTeams } from '../api/teams'
import { getLeagues } from '../api/leagues'
import MatchCard from '../components/MatchCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'scheduled', label: 'Upcoming' },
  { id: 'finished', label: 'Finished' },
]

export default function HomePage() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [matchData, teamData, leagueData] = await Promise.all([
          getMatches(), getTeams(), getLeagues(),
        ])
        if (!cancelled) {
          setMatches(matchData)
          setTeams(teamData)
          setLeagues(leagueData)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const teamMap = useMemo(() => {
    const map = {}
    teams.forEach((t) => { map[t.id] = t })
    return map
  }, [teams])

  const leagueMap = useMemo(() => {
    const map = {}
    leagues.forEach((l) => { map[l.id] = l })
    return map
  }, [leagues])

  const filtered = useMemo(() => {
    let list = [...matches]
    if (filter === 'live') {
      list = list.filter((m) => ['live', 'in_play'].includes((m.status || '').toLowerCase()))
    } else if (filter === 'scheduled') {
      list = list.filter((m) => (m.status || '').toLowerCase() === 'scheduled')
    } else if (filter === 'finished') {
      list = list.filter((m) => (m.status || '').toLowerCase() === 'finished')
    }
    list.sort((a, b) => {
      const order = (s) => {
        const st = (s || '').toLowerCase()
        if (st === 'live' || st === 'in_play') return 0
        if (st === 'scheduled') return 1
        return 2
      }
      const oa = order(a.status), ob = order(b.status)
      if (oa !== ob) return oa - ob
      return new Date(a.match_date) - new Date(b.match_date)
    })
    return list
  }, [matches, filter])

  if (loading) return <LoadingSpinner message="Loading matches…" />

  return (
    <div>
      <div className="page-header">
        <h1>Matches</h1>
        <p>Live scores, fixtures, and results</p>
      </div>
      {error && (
        <div className="error-banner">
          Could not load data: {error}. Make sure the backend is running on port 5000.
        </div>
      )}
      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f.id} type="button"
            className={`filter-chip${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} strokeWidth={1.5} />}
          title="No matches found"
          description={error
            ? 'Check that the backend API is running and the database has data.'
            : filter === 'all'
              ? 'Add matches via the backend API to see them here.'
              : `No ${filter} matches right now.`}
        />
      ) : (
        <div className="match-list">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match}
              homeTeam={teamMap[match.home_team_id]}
              awayTeam={teamMap[match.away_team_id]}
              league={leagueMap[match.league_id]} />
          ))}
        </div>
      )}
    </div>
  )
}
