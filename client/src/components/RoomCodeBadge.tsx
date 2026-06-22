import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

export default function RoomCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-amber-400/60 bg-amber-50 px-6 py-3 transition hover:bg-amber-100 active:scale-95"
    >
      <span className="font-mono text-3xl font-bold tracking-[0.3em] text-amber-700">{code}</span>
      {copied ? (
        <CheckIcon className="text-green-600" />
      ) : (
        <ContentCopyIcon className="text-amber-500 group-hover:text-amber-700" />
      )}
    </button>
  )
}
