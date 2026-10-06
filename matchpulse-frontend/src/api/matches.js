import api from './client'

export async function getMatches() {
  const { data } = await api.get('/api/matches')
  return data.matches || []
}

export async function getMatch(id) {
  const { data } = await api.get(`/api/matches/${id}`)
  return data
}

export async function getMatchOverview(id) {
  const { data } = await api.get(`/api/matches/${id}/overview`)
  return data
}
