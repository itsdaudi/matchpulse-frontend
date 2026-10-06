import api from './client'

export async function getLeagues() {
  const { data } = await api.get('/api/leagues')
  return data.leagues || []
}

export async function getLeague(id) {
  const { data } = await api.get(`/api/leagues/${id}`)
  return data
}
