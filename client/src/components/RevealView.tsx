import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import HomeIcon from '@mui/icons-material/Home'
import type { Story } from '../types'

interface Props {
  story: Story
  onExit: () => void
}

export default function RevealView({ story, onExit }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg">
            <AutoStoriesIcon />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">La tua storia è pronta!</h1>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <RecordVoiceOverIcon fontSize="small" /> Leggila ad alta voce agli altri
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          {story.lines.map((line, i) => (
            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">{line.question}</p>
              <p className="text-lg font-medium text-slate-800">{line.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onExit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          <HomeIcon fontSize="small" /> Torna alla home
        </button>
      </div>
    </div>
  )
}
