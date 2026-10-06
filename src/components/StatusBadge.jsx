import { statusLabel } from '../utils/format'

export default function StatusBadge({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'live' || s === 'in_play') {
    return (
      <span className="badge badge-live">
        <span className="pulse" />
        Live
      </span>
    )
  }
  if (s === 'finished') {
    return <span className="badge badge-finished">{statusLabel(status)}</span>
  }
  return <span className="badge badge-scheduled">{statusLabel(status)}</span>
}
