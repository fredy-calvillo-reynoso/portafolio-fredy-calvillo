// api/deezer.js — Deezer via proxy Vercel
const PROXY = 'https://fyga-proxy-app.vercel.app/api/deezer';

export async function obtenerCanciones(busqueda) {
  const base = (busqueda && busqueda.trim())
    ? `${PROXY}?q=${encodeURIComponent(busqueda.trim())}&limit=30`
    : `${PROXY}?limit=30`;

  const titulo = (busqueda && busqueda.trim())
    ? '<i class="bi bi-search"></i> Resultados de búsqueda'
    : '<i class="bi bi-stars"></i> Recomendados del momento';

  try {
    const res  = await fetch(base, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return { titulo, data: json.data ?? [] };
  } catch {
    return {
      titulo: '<i class="bi bi-wifi-off"></i> Sin conexión a Deezer',
      data:   []
    };
  }
}