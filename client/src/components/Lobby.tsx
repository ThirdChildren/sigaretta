import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import type { RoomState } from "../types";
import RoomCodeBadge from "./RoomCodeBadge";

interface Props {
  room: RoomState;
  isHost: boolean;
  myId: string;
  onStart: () => void;
  error: string | null;
}

export default function Lobby({ room, isHost, myId, onStart, error }: Props) {
  const canStart = room.players.length >= 3;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="mb-1 text-center text-2xl font-extrabold text-slate-800">
          Sala d'attesa
        </h1>
        <p className="mb-5 text-center text-sm text-slate-500">
          Condividi questo codice con gli altri giocatori
        </p>

        <div className="mb-6 flex justify-center">
          <RoomCodeBadge code={room.code} />
        </div>

        <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Giocatori ({room.players.length})</span>
          {!canStart && (
            <span className="text-amber-600">Minimo 3 per iniziare</span>
          )}
        </div>

        <ul className="mb-6 flex flex-col gap-2">
          {room.players.map((p) => (
            <li
              key={p.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                p.id === myId
                  ? "border-amber-300 bg-amber-50"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <PersonIcon fontSize="small" className="text-slate-400" />
                {p.name}
                {p.id === myId && (
                  <span className="text-xs text-amber-500">(tu)</span>
                )}
              </span>
              <span className="flex items-center gap-2">
                {!p.connected && (
                  <WifiOffIcon fontSize="small" className="text-red-400" />
                )}
                {p.isHost && (
                  <StarIcon fontSize="small" className="text-amber-500" />
                )}
              </span>
            </li>
          ))}
        </ul>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {isHost ? (
          <button
            onClick={onStart}
            disabled={!canStart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlayArrowIcon /> Inizia la partita
          </button>
        ) : (
          <p className="text-center text-sm text-slate-400">
            In attesa che il creatore della stanza inizi la partita...
          </p>
        )}
      </div>
    </div>
  );
}
