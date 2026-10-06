export function formatMatchDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export function formatMatchTime(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatDateTime(iso) {
  if (!iso) return ''
  return `${formatMatchDate(iso)} · ${formatMatchTime(iso)}`
}

export function formatMinute(minute, addedTime) {
  if (addedTime) return `${minute}+${addedTime}'`
  return `${minute}'`
}

export function statusLabel(status) {
  const map = {
    live: 'Live', scheduled: 'Scheduled', finished: 'FT',
    postponed: 'Postponed', cancelled: 'Cancelled',
  }
  return map[status?.toLowerCase()] || status || 'Unknown'
}

export function initials(name) {
  if (!name) return '?'
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function eventLabel(type) {
  const map = {
    goal: 'Goal', yellow_card: 'Yellow Card',
    red_card: 'Red Card', substitution: 'Sub',
  }
  return map[type] || type
}
