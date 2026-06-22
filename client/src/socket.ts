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

let currentPlayerId: string | null = getPlayerId() ?? null
const playerIdListeners = new Set<() => void>()

export function getCurrentPlayerId(): string | null {
  return currentPlayerId
}

export function subscribePlayerId(callback: () => void): () => void {
  playerIdListeners.add(callback)
  return () => playerIdListeners.delete(callback)
}

socket.on('session', ({ playerId }: { playerId: string }) => {
  currentPlayerId = playerId
  setPlayerId(playerId)
  playerIdListeners.forEach((cb) => cb())
})
