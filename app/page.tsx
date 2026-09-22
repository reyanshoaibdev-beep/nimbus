'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoardHeader } from '@/components/board-header'
import { BoardFooter } from '@/components/board-footer'
import { Countdown } from '@/components/countdown'
import { AdSlot } from '@/components/ad-slot'
import { ShareModal } from '@/components/share-modal'
import { useRelease } from '@/hooks/use-release'

const TEST_ROLL = '111222'

export default function LandingPage() {
  const router = useRouter()
  const { released, remaining, loading } = useRelease()

  const [roll, setRoll] = useState('')
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [prebooked, setPrebooked] = useState(false)

  const handlePrimary = () => {
    setError('')
    const value = roll.trim()

    if (!/^\d{4,10}$/.test(value)) {
      setError('درج کیا گیا رول نمبر درست نہیں ہے۔')
      return
    }

    if (released) {
      // Result is out — continue to the search page (prefill the roll number).
      router.push(`/search?roll=${encodeURIComponent(value)}`)
      return
    }

    // Not released yet — open the pre-booking share modal.
    setModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <BoardHeader />

      <Countdown remaining={remaining} released={released} loading={loading} />

      {/* Pre-book / search section */}
      <section className="mx-auto max-w-3xl px-4 py-6">
        <div className="border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-board-tint px-4 py-3">
            <h2 className="text-lg font-bold text-board-dark">
              {released ? 'اپنا نتیجہ دیکھیں' : 'اپنا رول نمبر پہلے سے درج کریں'}
            </h2>
          </div>

          <div className="px-4 py-5">
            {!released ? (
              <p className="mb-4 text-sm leading-7 text-gray-600">
                اپنا رول نمبر درج کریں تاکہ نتیجہ جاری ہوتے ہی آپ آسانی سے اپنا نتیجہ دیکھ سکیں۔
              </p>
            ) : (
              <p className="mb-4 text-sm leading-7 text-gray-600">
                نتیجہ جاری ہو چکا ہے۔ اپنا رول نمبر درج کر کے آگے بڑھیں۔
              </p>
            )}

            <label htmlFor="roll" className="mb-1.5 block text-sm font-semibold text-gray-800">
              رول نمبر
            </label>
            <input
              id="roll"
              inputMode="numeric"
              autoComplete="off"
              placeholder="رول نمبر درج کریں"
              value={roll}
              onChange={(e) => {
                setRoll(e.target.value.replace(/[^\d]/g, ''))
                if (error) setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handlePrimary()
              }}
              className="urdu-digits w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg tracking-wide outline-none focus:border-board focus:ring-2 focus:ring-board/30"
              dir="ltr"
            />

            {error ? (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {error}
              </p>
            ) : null}

            {prebooked && !released ? (
              <p className="mt-2 text-sm font-medium text-board-dark">
                آپ کا رول نمبر محفوظ کر لیا گیا ہے۔ نتیجہ 8:45 بجے دستیاب ہوگا۔
              </p>
            ) : null}

            <button
              type="button"
              onClick={handlePrimary}
              className="mt-4 w-full rounded-md bg-board px-4 py-3 text-base font-semibold text-white hover:bg-board-dark"
            >
              {released ? 'اپنا نتیجہ دیکھیں' : 'تصدیق کریں'}
            </button>

            {!released ? (
              <p className="mt-3 text-center text-xs text-gray-500">
                آزمائش کے لیے رول نمبر: <span className="urdu-digits font-semibold">{TEST_ROLL}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Ad — below the main countdown/search section */}
      <section className="mx-auto max-w-3xl px-4 pb-2">
        <AdSlot />
      </section>

      <BoardFooter />

      <ShareModal
        open={modalOpen}
        variant="prebook"
        onClose={() => setModalOpen(false)}
        onComplete={() => setPrebooked(true)}
      />
    </main>
  )
}
