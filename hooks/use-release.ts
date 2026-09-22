'use client'

import { useEffect, useRef, useState } from 'react'

type ReleaseState = {
  /** Whether the result has been released (08:45 AM PKT reached). */
  released: boolean
  /** Remaining ms until release. */
  remaining: number
  /** True until the authoritative server time has been fetched. */
  loading: boolean
}

/**
 * Counts down to 08:45 AM PKT using authoritative server time.
 *
 * It fetches the server's current UTC time once, records the offset from the
 * local clock, then ticks locally every second — so the countdown does not
 * depend solely on the user's (possibly incorrect) device clock.
 */
export function useRelease(): ReleaseState {
  const [state, setState] = useState<ReleaseState>({
    released: false,
    remaining: 0,
    loading: true,
  })
  // Offset = serverNowUtc - localNow, added to the local clock on each tick.
  const offsetRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    let interval: ReturnType<typeof setInterval> | undefined

    const compute = () => {
      const nowUtc = Date.now() + offsetRef.current
      // Recompute release target for the current PKT day locally.
      const pkt = new Date(nowUtc + 5 * 60 * 60 * 1000)
      const targetUtc =
        Date.UTC(pkt.getUTCFullYear(), pkt.getUTCMonth(), pkt.getUTCDate(), 8, 45, 0, 0) -
        5 * 60 * 60 * 1000
      const remaining = Math.max(0, targetUtc - nowUtc)
      setState({ released: remaining <= 0, remaining, loading: false })
    }

    ;(async () => {
      try {
        const res = await fetch('/api/time', { cache: 'no-store' })
        const data = (await res.json()) as { serverNowUtc: number }
        if (cancelled) return
        offsetRef.current = data.serverNowUtc - Date.now()
      } catch {
        // Fall back to the local clock if the server time is unavailable.
        offsetRef.current = 0
      }
      if (cancelled) return
      compute()
      interval = setInterval(compute, 1000)
    })()

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
  }, [])

  return state
}
