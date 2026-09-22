'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BoardHeader } from '@/components/board-header'
import { BoardFooter } from '@/components/board-footer'
import { AdSlot } from '@/components/ad-slot'
import { ShareModal } from '@/components/share-modal'
import { useSessionFlag } from '@/hooks/use-session-flag'
import { toUrduDigits } from '@/lib/format'
import type { StudentResult } from '@/lib/result'

function ResultView() {
  const params = useSearchParams()
  const roll = params.get('roll') ?? ''
  const year = params.get('year') ?? '2025'

  const [result, setResult] = useState<StudentResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Unlock state persists across navigation within the session so the UI does
  // not reset while moving between result sections.
  const [unlocked, setUnlocked] = useSessionFlag('result_unlocked')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rollNumber: roll, examYear: year }),
        })
        const data = await res.json()
        if (cancelled) return

        if (data.status === 'ok') {
          setResult(data.result)
        } else if (data.status === 'invalid') {
          setError('درج کیا گیا رول نمبر درست نہیں ہے۔')
        } else if (data.status === 'not_found') {
          setError('اس رول نمبر کا نتیجہ نہیں ملا۔')
        } else if (data.status === 'not_released') {
          setError('نتیجہ ابھی جاری نہیں ہوا۔ براہِ کرم 8:45 بجے کے بعد دوبارہ کوشش کریں۔')
        } else {
          setError('نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔')
        }
      } catch {
        if (!cancelled) setError('نتیجہ حاصل کرنے میں مسئلہ پیش آیا، براہِ کرم کچھ دیر بعد دوبارہ کوشش کریں۔')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [roll, year])

  // Show the unlock modal once the result is loaded and not yet unlocked.
  useEffect(() => {
    if (result && !unlocked) setModalOpen(true)
  }, [result, unlocked])

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-gray-500">نتیجہ لوڈ ہو رہا ہے…</div>
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="border border-red-200 bg-red-50 px-4 py-4 text-center text-sm font-medium text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-6">
        <div className="border border-gray-200 bg-white">
          {/* Result header */}
          <div className="border-b-2 border-board bg-board-tint px-4 py-4 text-center">
            <h2 className="text-xl font-bold text-board-dark">امتحانی نتیجہ</h2>
          </div>

          {/* Student info */}
          <dl className="grid grid-cols-1 gap-px border-b border-gray-200 bg-gray-200 sm:grid-cols-2">
            <InfoRow label="طالبِ علم کا نام" value={result.studentName} />
            <InfoRow label="والد کا نام" value={result.fatherName} />
            <InfoRow label="رول نمبر" value={<span className="urdu-digits">{toUrduDigits(result.rollNumber)}</span>} />
            <InfoRow label="امتحانی سال" value={<span className="urdu-digits">{toUrduDigits(result.examYear)}</span>} />
          </dl>

          {/* Subjects — always visible */}
          <div className="px-4 py-4">
            <h3 className="mb-3 text-base font-bold text-gray-800">مضامین اور نمبر</h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-board text-white">
                  <th className="border border-board-dark px-3 py-2 text-right font-semibold">مضمون</th>
                  <th className="border border-board-dark px-3 py-2 text-center font-semibold">کل نمبر</th>
                  <th className="border border-board-dark px-3 py-2 text-center font-semibold">حاصل کردہ</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((s) => (
                  <tr key={s.name} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2.5 text-right font-medium text-gray-800">
                      {s.name}
                    </td>
                    <td className="urdu-digits border border-gray-200 px-3 py-2.5 text-center text-gray-700">
                      {toUrduDigits(s.total)}
                    </td>
                    <td className="urdu-digits border border-gray-200 px-3 py-2.5 text-center font-semibold text-gray-900">
                      {toUrduDigits(s.obtained)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ad — between visible subject marks and the overall result */}
      <section className="mx-auto max-w-3xl px-4 pb-2">
        <AdSlot />
      </section>

      {/* Overall result — blurred until unlocked */}
      <section className="mx-auto max-w-3xl px-4 pt-2">
        <div className="border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-board-tint px-4 py-3">
            <h3 className="text-base font-bold text-board-dark">مجموعی نتیجہ</h3>
          </div>

          <div className="relative px-4 py-5">
            <dl
              className={`grid grid-cols-2 gap-3 transition-[filter] duration-300 ${
                unlocked ? '' : 'pointer-events-none select-none blur-md'
              }`}
              aria-hidden={!unlocked}
            >
              <StatBox label="حاصل کردہ نمبر" value={unlocked ? toUrduDigits(result.obtainedMarks) : '۴۵۶'} />
              <StatBox label="کل نمبر" value={unlocked ? toUrduDigits(result.totalMarks) : '۶۰۰'} />
              <StatBox label="فیصد" value={unlocked ? `${toUrduDigits(result.percentage)}٪` : '۸۸٪'} />
              <StatBox label="گریڈ" value={unlocked ? result.grade : 'A'} />
            </dl>

            {!unlocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/40 px-4 text-center">
                <p className="text-sm font-semibold text-board-dark">
                  مکمل نتیجہ دیکھنے کے لیے اسے شیئر کریں
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="rounded-md bg-board px-5 py-2.5 text-sm font-semibold text-white hover:bg-board-dark"
                >
                  نتیجہ کھولیں
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Ad — near the bottom of the result page */}
      <section className="mx-auto max-w-3xl px-4 pb-2 pt-4">
        <AdSlot />
      </section>

      <ShareModal
        open={modalOpen}
        variant="unlock"
        onClose={() => setModalOpen(false)}
        onComplete={() => setUnlocked(true)}
      />
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white px-4 py-3">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-center">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-1 text-xl font-bold text-board-dark">{value}</dd>
    </div>
  )
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-white">
      <BoardHeader />
      <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 text-center text-gray-500">لوڈ ہو رہا ہے…</div>}>
        <ResultView />
      </Suspense>
      <BoardFooter />
    </main>
  )
}
