// Remembers who a phone is, so a refresh or dropped connection rejoins the same team.
const KEY = "monopoly-session";
const ID_KEY = "monopoly-player-id";

export function getPlayerId() {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return "anon-" + Math.random().toString(16).slice(2);
  }
}

export function saveSession(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function loadSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
}
