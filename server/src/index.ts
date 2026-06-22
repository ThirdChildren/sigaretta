import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'
import {
  createRoom,
  getRoom,
  joinRoom,
  removePlayer,
  startGame,
  getPrompt,
  submitAnswer,
  publicState,
  revealStories,
  type Room,
} from './game.js'

const app = express()
app.use(cors())
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.get('/health', (_req, res) => res.json({ ok: true }))

function broadcastState(room: Room) {
  io.to(room.code).emit('room:update', publicState(room))
}

function sendPrompts(room: Room) {
  for (const player of room.players) {
    if (!player.connected) continue
    const prompt = getPrompt(room, player.id)
    io.to(player.id).emit('round:prompt', prompt)
  }
}

io.on('connection', (socket) => {
  const playerId = (socket.handshake.auth?.playerId as string) || randomUUID()
  socket.data.playerId = playerId
  socket.join(playerId)
  socket.emit('session', { playerId })

  socket.on('room:create', (data: { name: string }, ack) => {
    const name = (data?.name || '').trim().slice(0, 24) || 'Giocatore'
    const room = createRoom(playerId, name)
    socket.join(room.code)
    socket.data.roomCode = room.code
    ack?.({ ok: true, code: room.code })
    broadcastState(room)
  })

  socket.on('room:join', (data: { code: string; name: string }, ack) => {
    const name = (data?.name || '').trim().slice(0, 24) || 'Giocatore'
    const result = joinRoom(data?.code || '', playerId, name)
    if ('error' in result) {
      ack?.({ ok: false, error: result.error })
      return
    }
    socket.join(result.code)
    socket.data.roomCode = result.code
    ack?.({ ok: true, code: result.code })
    broadcastState(result)
  })

  socket.on('room:start', (data: { code: string }, ack) => {
    const room = getRoom(data?.code || '')
    if (!room) return ack?.({ ok: false, error: 'Stanza non trovata.' })
    const player = room.players.find((p) => p.id === playerId)
    if (!player?.isHost) return ack?.({ ok: false, error: 'Solo il padrone di casa può iniziare.' })
    const result = startGame(room)
    if (result && 'error' in result) return ack?.({ ok: false, error: result.error })
    ack?.({ ok: true })
    broadcastState(room)
    sendPrompts(room)
  })

  socket.on('answer:submit', (data: { code: string; text: string }, ack) => {
    const room = getRoom(data?.code || '')
    if (!room) return ack?.({ ok: false, error: 'Stanza non trovata.' })
    const text = (data?.text || '').trim().slice(0, 120)
    if (!text) return ack?.({ ok: false, error: 'Risposta vuota.' })
    const result = submitAnswer(room, playerId, text)
    if ('error' in result) return ack?.({ ok: false, error: result.error })
    ack?.({ ok: true })
    broadcastState(room)
    if (room.status === 'reveal') {
      io.to(room.code).emit('room:reveal', revealStories(room))
    } else {
      sendPrompts(room)
    }
  })

  socket.on('room:leave', (data: { code: string }) => {
    const room = getRoom(data?.code || '')
    if (!room) return
    removePlayer(room, playerId)
    socket.leave(room.code)
    if (room.players.length > 0) broadcastState(room)
  })

  socket.on('disconnect', () => {
    const code = socket.data.roomCode as string | undefined
    if (!code) return
    const room = getRoom(code)
    if (!room) return
    removePlayer(room, playerId)
    if (room.players.length > 0) broadcastState(room)
  })
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
httpServer.listen(PORT, () => {
  console.log(`Sigaretta server in ascolto su http://localhost:${PORT}`)
})
