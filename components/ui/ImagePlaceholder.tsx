import { ImageOff } from 'lucide-react'

export default function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#FAFCF9_0%,#F4FFF6_100%)] ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,203,140,0.16),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(62,154,96,0.12),transparent_40%)]" />
      <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl border border-[#DCEFDD]/80 bg-white/70 px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF8EC] text-[#3E9A60]">
          <ImageOff size={20} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C7A66]">Sin imagen</p>
      </div>
    </div>
  )
}
