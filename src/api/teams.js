import api from './client'

export async function getTeams() {
  const { data } = await api.get('/api/teams')
  return data.teams || []
}

export async function getTeam(id) {
  const { data } = await api.get(`/api/teams/${id}`)
  return data
}
