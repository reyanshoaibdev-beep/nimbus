'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoardHeader } from '@/components/board-header'
import { BoardFooter } from '@/components/board-footer'
import { Countdown } from '@/components/countdown'
import { AdSlot } from '@/components/ad-slot'
import { ShareModal } from '@/components/share-modal'
import { TermsModal } from '@/components/terms-modal'
import { useRelease } from '@/hooks/use-release'

export default function LandingPage() {
  const router = useRouter()
  const { released, remaining, loading } = useRelease()

  const [roll, setRoll] = useState('')
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [prebooked, setPrebooked] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const handlePrimary = () => {
    setError('')
    const value = roll.trim()

    if (!/^\d{4,10}$/.test(value)) {
      setError('درج کیا گیا رول نمبر درست نہیں ہے۔')
      return
    }

    if (!agreed) {
      setError('براہِ کرم آگے بڑھنے کے لیے شرائط و ضوابط سے اتفاق کریں۔')
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

      <section className="mx-auto max-w-5xl px-4 pt-3">
        <AdSlot label="اشتہار اوپر" />
      </section>

      <Countdown remaining={remaining} released={released} loading={loading} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-start">
        <div>
          {/* Pre-book / search section */}
          <section className="mx-auto max-w-3xl py-6 lg:mx-0">
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

                <p className="mx-auto mt-4 max-w-md text-center text-xs leading-6 text-gray-500">
                  اگر کسی بھی وجہ سے ہمیں بورڈ کی API سے نتیجہ موصول نہ ہو یا تاخیر سے ملے، تو نتیجہ
                  نہ بھیجا جا سکتا ہے اور نہ ہی دکھایا جا سکتا ہے۔
                </p>

                <label className="mt-4 flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked)
                      if (error) setError('')
                    }}
                    className="mt-0.5 size-4 shrink-0 accent-board"
                  />
                  <span>
                    میں{' '}
                    <button
                      type="button"
                      onClick={() => setTermsOpen(true)}
                      className="font-semibold text-board underline underline-offset-2 hover:text-board-dark"
                    >
                      شرائط و ضوابط
                    </button>{' '}
                    سے اتفاق کرتا/کرتی ہوں۔
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handlePrimary}
                  disabled={!agreed}
                  className="mt-4 w-full rounded-md bg-board px-4 py-3 text-base font-semibold text-white hover:bg-board-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {released ? 'اپنا نتیجہ دیکھیں' : 'تصدیق کریں'}
                </button>
              </div>
            </div>
          </section>

          <section className="max-w-3xl pb-2">
            <AdSlot label="اشتہار درمیان میں" />
          </section>

          <section className="max-w-3xl pb-4">
            <AdSlot label="اشتہار نیچے" />
          </section>
        </div>

        <aside className="hidden lg:block lg:pt-6">
          <AdSlot desktopSize="160x600" mobileSize="320x50" label="اشتہار سائیڈ" />
        </aside>
      </div>

      <BoardFooter />

      <ShareModal
        open={modalOpen}
        variant="prebook"
        onClose={() => setModalOpen(false)}
        onComplete={() => setPrebooked(true)}
      />

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </main>
  )
}
