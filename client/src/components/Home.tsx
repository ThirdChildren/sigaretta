import { useState } from "react";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LoginIcon from "@mui/icons-material/Login";

interface Props {
  onCreate: (name: string) => void;
  onJoin: (name: string, code: string) => void;
  error: string | null;
  busy: boolean;
}

export default function Home({ onCreate, onJoin, error, busy }: Props) {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "create") onCreate(name);
    else onJoin(name, code);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg">
            <SmokingRoomsIcon fontSize="large" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Sigaretta</h1>
          <p className="mt-1 text-sm text-slate-500">
            Il gioco della sigaretta: scrivi, piega, passa e pisciati addosso!
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "create"
                ? "bg-white text-amber-600 shadow"
                : "text-slate-500"
            }`}
          >
            <GroupAddIcon fontSize="small" /> Crea stanza
          </button>
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "join"
                ? "bg-white text-amber-600 shadow"
                : "text-slate-500"
            }`}
          >
            <LoginIcon fontSize="small" /> Entra
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Il tuo nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder="Es. Marco"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {mode === "join" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Codice stanza
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={5}
                placeholder="ABCDE"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center font-mono text-2xl uppercase tracking-[0.3em] text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              busy || !name.trim() || (mode === "join" && code.length < 5)
            }
            className="mt-1 rounded-xl bg-amber-500 py-3 font-bold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === "create" ? "Crea la stanza" : "Entra nella stanza"}
          </button>
        </form>
      </div>
    </div>
  );
}
