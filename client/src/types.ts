export type RoomStatus = 'lobby' | 'playing' | 'reveal'

export interface PlayerPublic {
  id: string
  name: string
  isHost: boolean
  connected: boolean
}

export interface RoomState {
  code: string
  status: RoomStatus
  round: number
  totalRounds: number
  players: PlayerPublic[]
  submittedCount: number
  activeCount: number
}

export interface Prompt {
  question: string
  round: number
}

export interface StoryLine {
  question: string
  text: string
  authorName: string
}

export interface Story {
  id: number
  lines: StoryLine[]
}

export interface Ack {
  ok: boolean
  error?: string
  code?: string
}
