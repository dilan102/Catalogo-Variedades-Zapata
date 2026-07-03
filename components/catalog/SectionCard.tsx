import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Section } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

const sectionImages: Record<string, string> = {
  dama: '/Silueta_dama_seccion.jpg',
  caballero: '/silueta_caballero_seccion.jpeg',
  joven: '/silueta_joven_seccion.jpg',
  nino: '/silueta_niño_seccion.jpg',
  nina: '/silueta_niña_seccion.jpeg',
  accesorios: '/silueta_accesorios_seccion.jpeg',
  edredones: '/silueta_edredones_seccion.jpg',
  esika: '/silueta_esika_seccion.jpg',
}

export default function SectionCard({ section }: { section: Section }) {
  const imageUrl = section.image_url || sectionImages[section.slug]
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const hasImage = Boolean(imageUrl) && !imageError

  return (
    <Link
      href={`/${section.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl border border-[#DCEFDD] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="absolute inset-0 overflow-hidden bg-[#FAFCF9]">
        {hasImage ? (
          <>
            <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={imageUrl!}
                alt={section.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-[#EAF8EC]" />}
          </>
        ) : (
          <ImagePlaceholder className="absolute inset-0" />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F2A1A]/90 via-[#0F2A1A]/55 to-transparent p-5">
        <p className="font-serif text-lg font-semibold leading-tight text-white sm:text-xl">{section.name}</p>
        {section.description && <p className="mt-2 text-xs text-white/80 sm:text-sm">{section.description}</p>}
      </div>
    </Link>
  )
}
