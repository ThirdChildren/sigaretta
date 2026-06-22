import { io } from 'socket.io-client'

const PLAYER_ID_KEY = 'sigaretta:playerId'

function getPlayerId(): string | undefined {
  return localStorage.getItem(PLAYER_ID_KEY) || undefined
}

export function setPlayerId(id: string) {
  localStorage.setItem(PLAYER_ID_KEY, id)
}

const URL = import.meta.env.VITE_SERVER_URL || undefined

export const socket = io(URL, {
  autoConnect: true,
  auth: { playerId: getPlayerId() },
})

socket.on('session', ({ playerId }: { playerId: string }) => {
  setPlayerId(playerId)
})
