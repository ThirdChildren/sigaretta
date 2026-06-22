import { useState } from 'react'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HomeIcon from '@mui/icons-material/Home'
import type { Story } from '../types'

interface Props {
  stories: Story[]
  onExit: () => void
}

export default function RevealView({ stories, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const story = stories[index]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg">
            <AutoStoriesIcon />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Le storie sono pronte!</h1>
          <p className="text-sm text-slate-500">
            Storia {index + 1} di {stories.length}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          {story.lines.map((line, i) => (
            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">{line.question}</p>
              <p className="text-lg font-medium text-slate-800">{line.text}</p>
              <p className="mt-1 text-xs text-slate-400">&mdash; {line.authorName}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          >
            <ArrowBackIosNewIcon fontSize="small" /> Prima
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            <HomeIcon fontSize="small" /> Home
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(stories.length - 1, i + 1))}
            disabled={index === stories.length - 1}
            className="flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          >
            Dopo <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  )
}
