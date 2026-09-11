// ── Global application deadline (single source of truth) ──────────────
// Stage 1 hiring closes Sep 18, 2026 23:59 IST (= Sep 18, 18:29 UTC).
// Used by the countdown (client) and to reject late POSTs (server/worker).
export const APPLICATION_DEADLINE_ISO = '2026-09-18T18:29:00.000Z';
export const APPLICATION_DEADLINE_LABEL = 'SEP 18, 11:59 PM IST';

export function isApplicationsOpen(nowMs: number = Date.now()): boolean {
  return nowMs < Date.parse(APPLICATION_DEADLINE_ISO);
}

/** Display string for a fixed ISO deadline in IST, e.g. "SEP 18, 11:59 PM IST". */
export function formatDeadlineIST(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dayPeriod = (get('dayPeriod') || '').toUpperCase();
  return `${get('month')} ${get('day')}, ${get('hour')}:${get('minute')} ${dayPeriod} IST`.toUpperCase();
}
