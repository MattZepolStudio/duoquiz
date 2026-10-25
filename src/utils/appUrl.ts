/**
 * Helper to get the correct URL for DuoQuiz 2-phone mode in AI Studio.
 */

const KNOWN_DEV_URL = 'https://ais-dev-xgcintqjmavn5fxhzbjocg-379362514205.europe-west2.run.app';

let cachedAppBaseUrl: string | null = null;

// Fetch server-provided URL if available
export async function initAppUrl(): Promise<string> {
  if (cachedAppBaseUrl) return cachedAppBaseUrl;
  
  try {
    const res = await fetch('/api/app-info');
    if (res.ok) {
      const data = await res.json();
      if (data.publicUrl) {
        cachedAppBaseUrl = data.publicUrl;
        return data.publicUrl;
      }
    }
  } catch {
    // Ignore fetch error, fallback to client resolution
  }

  cachedAppBaseUrl = resolvePublicBaseUrl();
  return cachedAppBaseUrl;
}

export function resolvePublicBaseUrl(): string {
  if (typeof window === 'undefined') {
    return KNOWN_DEV_URL;
  }

  const { origin } = window.location;

  // Local development fallback
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin;
  }

  if (origin && !origin.includes('about:') && !origin.includes('aistudio.google.com') && origin.startsWith('http')) {
    return origin;
  }

  return KNOWN_DEV_URL;
}

export function getPublicRoomUrl(roomCode?: string): string {
  const base = cachedAppBaseUrl || resolvePublicBaseUrl();
  const cleanBase = base.replace(/\/$/, '');
  return roomCode ? `${cleanBase}?room=${encodeURIComponent(roomCode.trim().toUpperCase())}` : cleanBase;
}

