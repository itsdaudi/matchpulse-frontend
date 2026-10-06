import { initials } from '../utils/format'

export default function TeamLogo({ team, size }) {
  const style = size ? { width: size, height: size } : undefined
  if (team?.logo) {
    return (
      <img src={team.logo} alt={team.name || ''} className="team-logo" style={style}
        onError={(e) => { e.currentTarget.style.display = 'none' }} />
    )
  }
  return (
    <div className="team-logo-placeholder" style={style}>
      {initials(team?.name || team?.short_name)}
    </div>
  )
}
