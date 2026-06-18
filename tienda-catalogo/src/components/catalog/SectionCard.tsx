import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

export default function SectionCard({ section }: { section: Section }) {
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square rounded-2xl overflow-hidden bg-stone-100">
      {section.image_url && (
        <Image
          src={section.image_url}
          alt={section.name}
          fill
          className="object-cover transition-transform duration-500 group-active:scale-105"
          sizes="50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3">
        <p className="text-white font-semibold text-base leading-tight">{section.name}</p>
        {section.description && (
          <p className="text-white/70 text-xs mt-0.5 leading-tight">{section.description}</p>
        )}
      </div>
    </Link>
  )
}
