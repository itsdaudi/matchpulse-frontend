import api from './client'

export async function getPlayers(params = {}) {
  const { data } = await api.get('/api/players', { params })
  return data.players || []
}

export async function getPlayer(id) {
  const { data } = await api.get(`/api/players/${id}`)
  return data
}

export async function getTeamPlayers(teamId) {
  const { data } = await api.get(`/api/teams/${teamId}/players`)
  return data
}
