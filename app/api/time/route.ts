import { NextResponse } from 'next/server'
import { msUntilRelease, isResultReleased } from '@/lib/time'

// Authoritative server time so the countdown does not rely solely on the
// user's (possibly wrong) device clock. The client fetches this once, works
// out the offset from its local clock, and then ticks locally.
export const dynamic = 'force-dynamic'

export async function GET() {
  const now = Date.now()
  return NextResponse.json({
    serverNowUtc: now,
    msUntilRelease: msUntilRelease(now),
    released: isResultReleased(now),
  })
}
