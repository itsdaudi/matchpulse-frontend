const STAT_KEYS = [
  { key: 'possession', label: 'Possession %' },
  { key: 'shots', label: 'Shots' },
  { key: 'shots_on_target', label: 'Shots on Target' },
  { key: 'shots_off_target', label: 'Shots off Target' },
  { key: 'corners', label: 'Corners' },
  { key: 'fouls', label: 'Fouls' },
  { key: 'offsides', label: 'Offsides' },
  { key: 'yellow_cards', label: 'Yellow Cards' },
  { key: 'red_cards', label: 'Red Cards' },
  { key: 'passes', label: 'Passes' },
  { key: 'pass_accuracy', label: 'Pass Accuracy %' },
]

export default function TeamStatsComparison({ teamStats, homeTeamId }) {
  if (!teamStats?.length) {
    return <div className="empty-state" style={{ padding: '2rem' }}><p>No team statistics available.</p></div>
  }
  const home = teamStats.find((s) => s.team_id === homeTeamId) || {}
  const away = teamStats.find((s) => s.team_id !== homeTeamId) || {}

  return (
    <div className="stats-list">
      {STAT_KEYS.map(({ key, label }) => {
        const hv = home[key] ?? 0
        const av = away[key] ?? 0
        const total = hv + av || 1
        return (
          <div key={key} className="stat-row">
            <div className="stat-value left">{hv}</div>
            <div className="stat-bar-wrap">
              <div className="stat-label">{label}</div>
              <div className="stat-bars">
                <div className="stat-bar-home" style={{ width: `${(hv / total) * 100}%` }} />
                <div className="stat-bar-away" style={{ width: `${(av / total) * 100}%` }} />
              </div>
            </div>
            <div className="stat-value">{av}</div>
          </div>
        )
      })}
    </div>
  )
}
