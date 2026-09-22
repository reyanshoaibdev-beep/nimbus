// Pakistan Standard Time helpers. PKT is a fixed UTC+5 offset (no DST),
// so we can convert reliably from any UTC timestamp.

export const PKT_OFFSET_MS = 5 * 60 * 60 * 1000

// Result release time of day in PKT.
export const RELEASE_HOUR = 8
export const RELEASE_MINUTE = 45

/**
 * Given a UTC timestamp (ms), return the UTC timestamp of today's 08:45 AM
 * in Pakistan Standard Time (i.e. the release moment for the current PKT day).
 */
export function releaseTargetUtc(nowUtcMs: number): number {
  const pkt = new Date(nowUtcMs + PKT_OFFSET_MS)
  const target = Date.UTC(
    pkt.getUTCFullYear(),
    pkt.getUTCMonth(),
    pkt.getUTCDate(),
    RELEASE_HOUR,
    RELEASE_MINUTE,
    0,
    0,
  )
  return target - PKT_OFFSET_MS
}

/** Milliseconds remaining until release (0 once released). */
export function msUntilRelease(nowUtcMs: number): number {
  return Math.max(0, releaseTargetUtc(nowUtcMs) - nowUtcMs)
}

/** Whether the result is released for the current PKT day. */
export function isResultReleased(nowUtcMs: number = Date.now()): boolean {
  return nowUtcMs >= releaseTargetUtc(nowUtcMs)
}
