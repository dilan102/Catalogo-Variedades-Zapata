import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square rounded-3xl overflow-hidden bg-[#F5F5DC] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#6B8E23]/20">
      {section.image_url && (
        <Image src={section.image_url} alt={section.name} fill className="object-cover transition-transform duration-700 group-hover:scale-115" sizes="50vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#556B2F]/85 via-[#6B8E23]/40 to-transparent transition-all duration-500 group-hover:from-[#556B2F]/95 group-hover:via-[#6B8E23]/50" />
      <div className="absolute bottom-0 left-0 p-5 transition-transform duration-500 group-hover:translate-y-[-4px]">
        <p className="text-white font-serif font-semibold text-lg sm:text-xl leading-tight">{section.name}</p>
        {section.description && <p className="text-white/95 text-xs sm:text-sm mt-2 font-serif">{section.description}</p>}
      </div>
    </Link>
  )
}
