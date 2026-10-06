import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getMatchOverview } from '../api/matches'
import StatusBadge from '../components/StatusBadge'
import TeamLogo from '../components/TeamLogo'
import EventTimeline from '../components/EventTimeline'
import TeamStatsComparison from '../components/TeamStatsComparison'
import Lineups from '../components/Lineups'
import PlayerStatsTable from '../components/PlayerStatsTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDateTime } from '../utils/format'

const TABS = [
  { id: 'events', label: 'Events' },
  { id: 'stats', label: 'Stats' },
  { id: 'lineups', label: 'Lineups' },
  { id: 'players', label: 'Players' },
]

export default function MatchDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('events')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const overview = await getMatchOverview(id)
        if (!cancelled) setData(overview)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <LoadingSpinner message="Loading match…" />
  if (error || !data?.match) {
    return (
      <div>
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to matches</Link>
        <div className="error-banner">{error || 'Match not found'}</div>
      </div>
    )
  }

  const { match, team_stats, player_stats, events, lineups } = data
  const home = match.home_team
  const away = match.away_team

  return (
    <div>
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to matches</Link>
      <div className="detail-header">
        <div className="detail-league">
          <StatusBadge status={match.status} />
          <span>{formatDateTime(match.match_date)}</span>
        </div>
        <div className="detail-teams">
          <div className="detail-team">
            <TeamLogo team={home} size={56} />
            <span className="team-name">{home?.name || 'Home'}</span>
          </div>
          <div className="detail-score">
            {match.score?.home ?? 0}<span className="sep">–</span>{match.score?.away ?? 0}
          </div>
          <div className="detail-team">
            <TeamLogo team={away} size={56} />
            <span className="team-name">{away?.name || 'Away'}</span>
          </div>
        </div>
        {match.venue && <div className="detail-venue">{match.venue}</div>}
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button"
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === 'events' && <EventTimeline events={events} homeTeamId={home?.id} />}
      {tab === 'stats' && <TeamStatsComparison teamStats={team_stats} homeTeamId={home?.id} />}
      {tab === 'lineups' && <Lineups lineups={lineups} homeTeam={home} awayTeam={away} />}
      {tab === 'players' && <PlayerStatsTable playerStats={player_stats} />}
    </div>
  )
}
