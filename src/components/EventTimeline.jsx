import { formatMinute, eventLabel } from '../utils/format'

const ICON_MAP = { goal: '⚽', yellow_card: '🟨', red_card: '🟥', substitution: '🔄' }

export default function EventTimeline({ events, homeTeamId }) {
  if (!events?.length) {
    return <div className="empty-state" style={{ padding: '2rem' }}><p>No events recorded yet.</p></div>
  }
  return (
    <div className="timeline">
      {events.map((event) => {
        const isHome = event.team_id === homeTeamId
        const icon = ICON_MAP[event.event_type] || '•'
        const content = (
          <div className={`event-side ${isHome ? 'home' : 'away'}`}>
            {isHome && (
              <>
                <div>
                  <div className="event-player">{event.player?.name || eventLabel(event.event_type)}</div>
                  {event.assist_player && <div className="event-assist">Assist: {event.assist_player.name}</div>}
                  {event.event_type === 'substitution' && (
                    <div className="event-assist">
                      {event.substitution_out?.name && <span>↓ {event.substitution_out.name} </span>}
                      {event.substitution_in?.name && <span>↑ {event.substitution_in.name}</span>}
                    </div>
                  )}
                </div>
                <span className={`event-icon ${event.event_type}`}>{icon}</span>
              </>
            )}
            {!isHome && (
              <>
                <span className={`event-icon ${event.event_type}`}>{icon}</span>
                <div>
                  <div className="event-player">{event.player?.name || eventLabel(event.event_type)}</div>
                  {event.assist_player && <div className="event-assist">Assist: {event.assist_player.name}</div>}
                  {event.event_type === 'substitution' && (
                    <div className="event-assist">
                      {event.substitution_out?.name && <span>↓ {event.substitution_out.name} </span>}
                      {event.substitution_in?.name && <span>↑ {event.substitution_in.name}</span>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
        return (
          <div key={event.id} className="event-row">
            {isHome ? content : <div />}
            <div className="event-minute">{formatMinute(event.minute, event.added_time)}</div>
            {!isHome ? content : <div />}
          </div>
        )
      })}
    </div>
  )
}
