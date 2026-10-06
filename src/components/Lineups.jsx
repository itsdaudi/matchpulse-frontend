export default function Lineups({ lineups, homeTeam, awayTeam }) {
  if (!lineups?.length) {
    return <div className="empty-state" style={{ padding: '2rem' }}><p>Lineups not available yet.</p></div>
  }
  const byTeam = (teamId) => lineups.find((l) => l.team_id === teamId)
  const homeLineup = byTeam(homeTeam?.id) || lineups[0]
  const awayLineup = byTeam(awayTeam?.id) || lineups.find((l) => l !== homeLineup) || lineups[1]
  const cards = [
    { lineup: homeLineup, team: homeTeam },
    { lineup: awayLineup, team: awayTeam },
  ].filter((c) => c.lineup)

  return (
    <div className="lineups-grid">
      {cards.map(({ lineup, team }) => {
        const starters = (lineup.players || []).filter((p) => p.starter)
        const bench = (lineup.players || []).filter((p) => !p.starter)
        return (
          <div key={lineup.id} className="lineup-card">
            <div className="lineup-header">
              <h3>{team?.name || 'Team'}</h3>
              {lineup.formation && <span className="formation">{lineup.formation}</span>}
            </div>
            {starters.length > 0 && (
              <>
                <div className="section-title">Starting XI</div>
                {starters.map((p) => (
                  <div key={p.id} className="player-row">
                    <span className="shirt-num">{p.shirt_number ?? '–'}</span>
                    <span>{p.name}</span>
                    {p.position && <span className="player-pos">{p.position}</span>}
                  </div>
                ))}
              </>
            )}
            {bench.length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: '1rem' }}>Bench</div>
                {bench.map((p) => (
                  <div key={p.id} className="player-row">
                    <span className="shirt-num">{p.shirt_number ?? '–'}</span>
                    <span>{p.name}</span>
                    {p.position && <span className="player-pos">{p.position}</span>}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
