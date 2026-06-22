import { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import type { Prompt, RoomState } from '../types'

interface Props {
  room: RoomState
  prompt: Prompt | null
  onSubmit: (text: string) => void
  error: string | null
}

export default function PlayingView({ room, prompt, onSubmit, error }: Props) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setText('')
    setSubmitted(false)
  }, [prompt?.round])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setSubmitted(true)
  }

  const progress = `${room.submittedCount}/${room.activeCount}`

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Domanda {room.round + 1} di {room.totalRounds}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: room.totalRounds }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${i <= room.round ? 'bg-amber-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>

        <h2 className="mb-6 text-center text-3xl font-extrabold text-slate-800">{prompt?.question ?? '...'}</h2>

        {!submitted ? (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={120}
              placeholder="Scrivi la tua risposta, nessuno la vedrà finché la storia non è completa..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendIcon fontSize="small" /> Piega e passa
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircleIcon className="text-green-500" fontSize="large" />
            <p className="font-semibold text-slate-700">Risposta inviata!</p>
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <HourglassEmptyIcon fontSize="small" /> In attesa degli altri ({progress})
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
