import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {section.image_url && (
        <Image src={section.image_url} alt={section.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,107,60,0.85)] via-[rgba(62,154,96,0.4)] to-transparent transition-all duration-500 group-hover:from-[rgba(31,107,60,0.95)] group-hover:via-[rgba(62,154,96,0.5)]" />
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-white font-serif font-semibold text-lg sm:text-xl leading-tight">{section.name}</p>
        {section.description && <p className="text-white/95 text-xs sm:text-sm mt-2">{section.description}</p>}
      </div>
    </Link>
  )
}
