'use client'

import { padUrdu } from '@/lib/format'

function splitRemaining(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { hours, minutes, seconds }
}

export function Countdown({
  remaining,
  released,
  loading,
}: {
  remaining: number
  released: boolean
  loading: boolean
}) {
  const { hours, minutes, seconds } = splitRemaining(remaining)

  return (
    <section className="bg-board text-white">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center">
        {released ? (
          <>
            <p className="text-sm text-white/85">نتیجہ جاری ہو چکا ہے</p>
            <p className="mt-2 font-nastaliq text-2xl leading-relaxed sm:text-3xl">
              آپ اب اپنا نتیجہ دیکھ سکتے ہیں
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-white/85">نتیجہ جاری ہونے میں باقی وقت</p>
            <div
              className="mt-3 flex items-center justify-center gap-2 sm:gap-3"
              dir="ltr"
              aria-live="polite"
              aria-label="باقی وقت"
            >
              <TimeBox value={loading ? '00' : padUrdu(hours)} label="گھنٹے" />
              <span className="pb-6 text-3xl font-bold text-white/70">:</span>
              <TimeBox value={loading ? '00' : padUrdu(minutes)} label="منٹ" />
              <span className="pb-6 text-3xl font-bold text-white/70">:</span>
              <TimeBox value={loading ? '00' : padUrdu(seconds)} label="سیکنڈ" />
            </div>
            <p className="mt-4 text-sm text-white/85">
              نتیجہ صبح <span>8:45</span> بجے (پاکستان کا وقت) جاری کیا جائے گا
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="urdu-digits min-w-16 rounded-md bg-board-dark px-3 py-2 text-3xl font-bold tabular-nums sm:min-w-20 sm:text-4xl">
        {value}
      </span>
      <span className="mt-1 text-xs text-white/80" dir="rtl">
        {label}
      </span>
    </div>
  )
}
