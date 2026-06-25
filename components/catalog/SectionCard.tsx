import Image from 'next/image'
import Link from 'next/link'
import type { Section } from '@/types'

const sectionImages: Record<string, string> = {
  'dama': '/Dama.avif',
  'caballero': '/Caballero.jpg',
  'nino': '/Niño.webp',
  'nina': '/Niña.jpg',
  'accesorios': '/Accesorios.avif',
  'edredones': '/edredon.jpeg',
  'esika': '/Esika.png',
  'avon': '/Avon.png',
}

export default function SectionCard({ section }: { section: Section }) {
  const imageUrl = section.image_url || sectionImages[section.slug]
  return (
    <Link href={`/${section.slug}`} className="group relative block aspect-square bg-white rounded-2xl overflow-hidden border border-[#DCEFDD] shadow-sm hover:shadow-md transition-shadow duration-300">
      {imageUrl ? (
        <Image src={imageUrl} alt={section.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFCF9]">
          <span className="text-[#5C7A66] text-xs">Sin imagen</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,107,60,0.85)] via-[rgba(62,154,96,0.4)] to-transparent transition-all duration-500 group-hover:from-[rgba(31,107,60,0.95)] group-hover:via-[rgba(62,154,96,0.5)]" />
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-white font-serif font-semibold text-lg sm:text-xl leading-tight">{section.name}</p>
        {section.description && <p className="text-white/95 text-xs sm:text-sm mt-2">{section.description}</p>}
      </div>
    </Link>
  )
}
