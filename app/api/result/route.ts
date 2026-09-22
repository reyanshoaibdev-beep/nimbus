import { NextResponse } from 'next/server'
import { lookupResult } from '@/lib/result'
import { isResultReleased } from '@/lib/time'

// Backend result endpoint. The frontend only ever calls THIS route; it never
// talks to the BISE Multan API directly. When the real API is available,
// swap the `lookupResult` implementation (see lib/result.ts) for a fetch to
// the board API, reading credentials from server env vars, e.g.:
//
//   const apiKey = process.env.BISE_MULTAN_API_KEY
//   const res = await fetch('https://api.bisemultan.edu.pk/result', { ... })
//
// Keep API keys server-side only. Never send them to the browser.

export async function POST(request: Request) {
  let body: { rollNumber?: string; examYear?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔' },
      { status: 400 },
    )
  }

  const rollNumber = (body.rollNumber ?? '').toString()
  const examYear = (body.examYear ?? '').toString()

  // Enforce the release time on the server as well, so results cannot be
  // pulled before 08:45 AM PKT by calling the API directly.
  if (!isResultReleased()) {
    return NextResponse.json({ status: 'not_released' }, { status: 200 })
  }

  try {
    const result = lookupResult(rollNumber, examYear)
    return NextResponse.json(result, { status: 200 })
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔' },
      { status: 500 },
    )
  }
}
