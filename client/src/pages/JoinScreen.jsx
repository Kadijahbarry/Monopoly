import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import Button from "../components/ui/Button.jsx";
import { getPlayerId, saveSession, loadSession } from "../session";

export default function JoinScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already checked in on this phone? Go straight back to the game.
  useEffect(() => {
    if (loadSession()) navigate("/play/ready", { replace: true });
  }, [navigate]);

  function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const cleanCode = code.trim().toUpperCase();
    socket.emit("join", { code: cleanCode, name: name.trim(), playerId: getPlayerId() }, (res) => {
      setBusy(false);
      if (!res?.ok) return setError(res?.error || "Couldn't join. Try again.");
      saveSession({ code: cleanCode, name: name.trim(), team: res.team });
      navigate("/play/ready");
    });
  }

  return (
    <main className="join">
      <h1 className="title title-small">Monopoly Trivia</h1>
      <form className="deed join-card" onSubmit={submit}>
        <header className="deed-strip strip-green">Check in</header>
        <div className="deed-body">
          <label>
            Team code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="RED482"
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={8}
              required
            />
          </label>
          <label>
            Your name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              maxLength={20}
              autoComplete="off"
              required
            />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? "Joining..." : "Join game"}</Button>
        </div>
      </form>
    </main>
  );
}