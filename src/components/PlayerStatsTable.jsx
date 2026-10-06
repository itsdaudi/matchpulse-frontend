export default function PlayerStatsTable({ playerStats }) {
  if (!playerStats?.length) {
    return <div className="empty-state" style={{ padding: '2rem' }}><p>No player statistics available.</p></div>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="player-stats-table">
        <thead>
          <tr>
            <th>Player</th><th>Pos</th><th>Min</th><th>G</th><th>A</th>
            <th>Shots</th><th>Pass%</th><th>Tkl</th><th>YC</th><th>RC</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map((stat) => (
            <tr key={stat.id}>
              <td>
                <strong>{stat.player?.name || '–'}</strong>
                {stat.player?.shirt_number != null && (
                  <span style={{ color: 'var(--text-dim)', marginLeft: 6 }}>#{stat.player.shirt_number}</span>
                )}
              </td>
              <td>{stat.player?.position || '–'}</td>
              <td>{stat.minutes_played ?? '–'}</td>
              <td>{stat.goals ?? 0}</td>
              <td>{stat.assists ?? 0}</td>
              <td>
                {stat.shots ?? 0}
                {stat.shots_on_target != null && (
                  <span style={{ color: 'var(--text-dim)' }}> ({stat.shots_on_target})</span>
                )}
              </td>
              <td>{stat.pass_accuracy != null ? `${Math.round(stat.pass_accuracy)}%` : '–'}</td>
              <td>{stat.tackles ?? 0}</td>
              <td>{stat.yellow_cards ?? 0}</td>
              <td>{stat.red_cards ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
