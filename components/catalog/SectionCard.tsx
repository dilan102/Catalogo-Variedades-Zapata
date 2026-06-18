import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square rounded-3xl overflow-hidden bg-green-50 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100">
      {section.image_url && (
        <Image src={section.image_url} alt={section.name} fill className="object-cover transition-transform duration-700 group-hover:scale-115" sizes="33vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/85 via-emerald-800/40 to-transparent transition-all duration-500 group-hover:from-emerald-900/95 group-hover:via-emerald-800/50" />
      <div className="absolute bottom-0 left-0 p-5 transition-transform duration-500 group-hover:translate-y-[-4px]">
        <p className="text-white font-serif font-semibold text-lg sm:text-xl leading-tight italic">{section.name}</p>
        {section.description && <p className="text-white/95 text-xs sm:text-sm mt-2 font-serif italic">{section.description}</p>}
      </div>
    </Link>
  )
}
