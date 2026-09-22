export function AdSlot({ label = 'اشتہار' }: { label?: string }) {
  return (
    <div
      role="complementary"
      aria-label="اشتہاری جگہ"
      className="flex min-h-24 w-full items-center justify-center border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center"
    >
      <span className="text-xs tracking-wide text-gray-400">{label}</span>
    </div>
  )
}
