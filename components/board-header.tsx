import Link from 'next/link'

export function BoardHeader() {
  return (
    <header className="bg-board text-white">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-board-dark text-lg font-bold leading-none"
        >
          AI
        </div>
        <div className="min-w-0">
          <Link href="/" className="block" dir="ltr">
            <h1 className="text-base font-bold leading-tight sm:text-lg">
              Fast Result Getter AI
            </h1>
            <p className="text-xs text-white/80 sm:text-sm">امتحانی نتائج پورٹل</p>
          </Link>
        </div>
      </div>
      <div className="h-1 w-full bg-board-dark" />
    </header>
  )
}
