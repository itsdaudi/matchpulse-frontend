import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import TeamLogo from './TeamLogo'
import { formatMatchDate, formatMatchTime } from '../utils/format'

export default function MatchCard({ match, homeTeam, awayTeam, league }) {
  const isLive = ['live', 'in_play'].includes((match.status || '').toLowerCase())
  const isFinished = (match.status || '').toLowerCase() === 'finished'
  const showScore = isLive || isFinished

  return (
    <Link to={`/matches/${match.id}`} className="match-card">
      <div className="match-card-top">
        <div className="match-meta">
          {league?.name && <span>{league.name}</span>}
          {match.venue && (<><span>·</span><span>{match.venue}</span></>)}
        </div>
        <StatusBadge status={match.status} />
      </div>
      <div className="match-teams">
        <div className="team-side home">
          <TeamLogo team={homeTeam} />
          <span className="team-name">{homeTeam?.name || `Team #${match.home_team_id}`}</span>
        </div>
        <div className="score-block">
          {showScore ? (
            <div className="score">{match.home_score ?? 0} – {match.away_score ?? 0}</div>
          ) : (
            <div className="score vs">vs</div>
          )}
          {!isFinished && (
            <div className="kickoff-time">
              {isLive ? 'In progress' : `${formatMatchDate(match.match_date)} · ${formatMatchTime(match.match_date)}`}
            </div>
          )}
        </div>
        <div className="team-side away">
          <TeamLogo team={awayTeam} />
          <span className="team-name">{awayTeam?.name || `Team #${match.away_team_id}`}</span>
        </div>
      </div>
    </Link>
  )
}
