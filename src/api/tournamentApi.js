import apiClient from './axios'

export const getTournaments = async () => {
  const response = await apiClient.get('/tournaments')
  return response.data
}

export const getTournamentById = async (id) => {
  const response = await apiClient.get(`/tournaments/${id}`)
  return response.data
}

export const createTournament = async (data) => {
  const response = await apiClient.post('/tournaments', data)
  return response.data
}

export const joinTournament = async (id, userData) => {
  const response = await apiClient.post(`/tournaments/${id}/join`, userData)
  return response.data
}

export const getBracket = async (id) => {
  const response = await apiClient.get(`/tournaments/${id}/bracket`)
  return response.data
}

export const createBracket = async (id) => {
  const response = await apiClient.post(`/tournaments/${id}/bracket`)
  return response.data
}

export const selectWinner = async (tournamentId, matchId, winnerId) => {
  const response = await apiClient.patch(
    `/tournaments/${tournamentId}/matches/${matchId}/winner`,
    { winnerId },
  )
  return response.data
}

export const getMatchById = async (matchId) => {
  const response = await apiClient.get(`/matches/${matchId}`)
  return response.data
}

export const submitMatchScore = async (matchId, data) => {
  const response = await apiClient.patch(`/matches/${matchId}/score`, data)
  return response.data
}
