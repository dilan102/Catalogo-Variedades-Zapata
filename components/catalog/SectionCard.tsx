import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square rounded-2xl overflow-hidden bg-green-50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {section.image_url && (
        <Image src={section.image_url} alt={section.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="50vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/30 to-transparent transition-all duration-300 group-hover:from-green-900/90 group-hover:via-green-900/40" />
      <div className="absolute bottom-0 left-0 p-4 transition-transform duration-300 group-hover:translate-y-[-2px]">
        <p className="text-white font-semibold text-base sm:text-lg leading-tight">{section.name}</p>
        {section.description && <p className="text-white/90 text-xs sm:text-sm mt-1">{section.description}</p>}
      </div>
    </Link>
  )
}
