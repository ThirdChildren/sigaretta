import { useEffect, useState, useSyncExternalStore } from 'react'
import { socket, getCurrentPlayerId, subscribePlayerId } from './socket'
import type { Ack, Prompt, RoomState, Story } from './types'
import Home from './components/Home'
import Lobby from './components/Lobby'
import PlayingView from './components/PlayingView'
import RevealView from './components/RevealView'

export default function App() {
  const myId = useSyncExternalStore(subscribePlayerId, getCurrentPlayerId)
  const [room, setRoom] = useState<RoomState | null>(null)
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onUpdate = (state: RoomState) => {
      setRoom(state)
      if (state.status !== 'reveal') setStory(null)
    }
    const onPrompt = (p: Prompt | null) => setPrompt(p)
    const onReveal = (s: Story) => setStory(s)

    socket.on('room:update', onUpdate)
    socket.on('round:prompt', onPrompt)
    socket.on('room:reveal', onReveal)

    return () => {
      socket.off('room:update', onUpdate)
      socket.off('round:prompt', onPrompt)
      socket.off('room:reveal', onReveal)
    }
  }, [])

  const handleCreate = (name: string) => {
    setBusy(true)
    setError(null)
    socket.emit('room:create', { name }, (ack: Ack) => {
      setBusy(false)
      if (!ack.ok) setError(ack.error || 'Errore inatteso.')
    })
  }

  const handleJoin = (name: string, code: string) => {
    setBusy(true)
    setError(null)
    socket.emit('room:join', { name, code }, (ack: Ack) => {
      setBusy(false)
      if (!ack.ok) setError(ack.error || 'Errore inatteso.')
    })
  }

  const handleStart = () => {
    if (!room) return
    setError(null)
    socket.emit('room:start', { code: room.code }, (ack: Ack) => {
      if (!ack.ok) setError(ack.error || 'Errore inatteso.')
    })
  }

  const handleSubmit = (text: string) => {
    if (!room) return
    setError(null)
    socket.emit('answer:submit', { code: room.code, text }, (ack: Ack) => {
      if (!ack.ok) setError(ack.error || 'Errore inatteso.')
    })
  }

  const handleExit = () => {
    if (room) socket.emit('room:leave', { code: room.code })
    setRoom(null)
    setPrompt(null)
    setStory(null)
    setError(null)
  }

  if (!room || !myId) {
    return <Home onCreate={handleCreate} onJoin={handleJoin} error={error} busy={busy} />
  }

  if (room.status === 'lobby') {
    const isHost = room.players.find((p) => p.id === myId)?.isHost ?? false
    return <Lobby room={room} isHost={isHost} myId={myId} onStart={handleStart} error={error} />
  }

  if (room.status === 'playing') {
    return <PlayingView room={room} prompt={prompt} onSubmit={handleSubmit} error={error} />
  }

  if (room.status === 'reveal' && story) {
    return <RevealView story={story} onExit={handleExit} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">Caricamento...</div>
  )
}
