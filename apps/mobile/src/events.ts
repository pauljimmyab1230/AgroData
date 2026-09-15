type Listener = () => void;

const listeners: Listener[] = [];

export function onLogout(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function emit(event: string): void {
  if (event === "LOGOUT") {
    [...listeners].forEach((l) => {
      try { l(); } catch {}
    });
  }
}
