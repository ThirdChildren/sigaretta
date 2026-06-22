export const QUESTIONS = [
  'Chi?',
  'Con chi?',
  'Cosa succede?',
  'Dove succede?',
  'Come lo fanno?',
  'E alla fine?',
] as const

export type RoomStatus = 'lobby' | 'playing' | 'reveal'

export interface Player {
  id: string
  name: string
  isHost: boolean
  connected: boolean
}

export interface PaperAnswer {
  text: string
  authorId: string
  authorName: string
}

export interface Paper {
  id: number
  answers: PaperAnswer[]
}

export interface Room {
  code: string
  status: RoomStatus
  players: Player[]
  papers: Paper[]
  round: number
  submitted: Set<string>
}

const rooms = new Map<string, Room>()

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code: string
  do {
    code = Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('')
  } while (rooms.has(code))
  return code
}

export function createRoom(hostId: string, hostName: string): Room {
  const code = generateCode()
  const room: Room = {
    code,
    status: 'lobby',
    players: [{ id: hostId, name: hostName, isHost: true, connected: true }],
    papers: [],
    round: 0,
    submitted: new Set(),
  }
  rooms.set(code, room)
  return room
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase())
}

export function joinRoom(code: string, playerId: string, name: string): Room | { error: string } {
  const room = getRoom(code)
  if (!room) return { error: 'Stanza non trovata.' }
  if (room.status !== 'lobby') return { error: 'Partita già iniziata.' }
  if (room.players.some((p) => p.name.toLowerCase() === name.toLowerCase()))
    return { error: 'Nome già in uso in questa stanza.' }
  room.players.push({ id: playerId, name, isHost: false, connected: true })
  return room
}

export function removePlayer(room: Room, playerId: string) {
  if (room.status === 'lobby') {
    room.players = room.players.filter((p) => p.id !== playerId)
    if (room.players.length > 0 && !room.players.some((p) => p.isHost)) {
      room.players[0].isHost = true
    }
    if (room.players.length === 0) rooms.delete(room.code)
  } else {
    const player = room.players.find((p) => p.id === playerId)
    if (player) player.connected = false
  }
}

export function startGame(room: Room): { error: string } | void {
  if (room.players.length < 3) return { error: 'Servono almeno 3 giocatori.' }
  room.status = 'playing'
  room.round = 0
  room.papers = room.players.map((_, id) => ({ id, answers: [] }))
  room.submitted = new Set()
}

function paperForPlayer(room: Room, playerIndex: number): number {
  const n = room.players.length
  return ((playerIndex - room.round) % n + n) % n
}

export function getPrompt(room: Room, playerId: string): { question: string; round: number } | null {
  if (room.status !== 'playing') return null
  const playerIndex = room.players.findIndex((p) => p.id === playerId)
  if (playerIndex === -1) return null
  return { question: QUESTIONS[room.round], round: room.round }
}

export function submitAnswer(room: Room, playerId: string, text: string): { error: string } | { done: boolean } {
  if (room.status !== 'playing') return { error: 'La partita non è in corso.' }
  const playerIndex = room.players.findIndex((p) => p.id === playerId)
  if (playerIndex === -1) return { error: 'Giocatore non trovato.' }
  if (room.submitted.has(playerId)) return { error: 'Risposta già inviata.' }
  const paperId = paperForPlayer(room, playerIndex)
  const player = room.players[playerIndex]
  room.papers[paperId].answers[room.round] = { text: text.trim(), authorId: playerId, authorName: player.name }
  room.submitted.add(playerId)

  const allSubmitted = room.players.filter((p) => p.connected).every((p) => room.submitted.has(p.id))
  if (allSubmitted) {
    if (room.round >= QUESTIONS.length - 1) {
      room.status = 'reveal'
    } else {
      room.round += 1
      room.submitted = new Set()
    }
    return { done: true }
  }
  return { done: false }
}

export function publicState(room: Room) {
  return {
    code: room.code,
    status: room.status,
    round: room.round,
    totalRounds: QUESTIONS.length,
    players: room.players.map((p) => ({ id: p.id, name: p.name, isHost: p.isHost, connected: p.connected })),
    submittedCount: room.submitted.size,
    activeCount: room.players.filter((p) => p.connected).length,
  }
}

export function revealStories(room: Room) {
  return room.papers.map((paper) => ({
    id: paper.id,
    lines: paper.answers.map((a, i) => ({ question: QUESTIONS[i], text: a.text })),
  }))
}

export function assignStoriesToPlayers(room: Room): Map<string, number> {
  const storyIds = room.papers.map((p) => p.id)
  for (let i = storyIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[storyIds[i], storyIds[j]] = [storyIds[j], storyIds[i]]
  }
  const assignment = new Map<string, number>()
  room.players.forEach((p, i) => assignment.set(p.id, storyIds[i % storyIds.length]))
  return assignment
}
