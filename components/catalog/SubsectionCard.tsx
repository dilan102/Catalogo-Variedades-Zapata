import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import type { Subsection } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

const imagesBySlug: Record<string, Record<string, string>> = {
  dama: {
    pantalones: '/pantalon_dama.webp',
    camisas: '/camisa_dama.jpeg',
    chaquetas: '/chaqueta_dama.jpeg',
    sacos: '/saco_dama.jpg',
    blusas: '/blusa_dama.jpeg',
    vestidos: '/vestido_dama.jpeg',
    'ropa-deportiva': '/ropa_deportiva_dama.jpeg',
    corsets: '/corset_dama.jpg',
    'ropa-interior': '/ropa_interior_dama.jpeg',
    medias: '/medias_dama.jpg',
    zapatos: '/zapatos_dama.jpg',
    conjuntos: '/conjunto_dama.jpeg',
    faldas: '/faldas_dama.jpeg',
    pijama: '/pijama_dama.jpeg',
  },
  caballero: {
    pantalones: '/pantalon_caballero.jpeg',
    pantalonetas: '/pantaloneta_caballero.jpeg',
    camisas: '/camisa_caballero.jpeg',
    sacos: '/saco_caballero.jpg',
    chaquetas: '/Chaqueta_caballero.jpeg',
    medias: '/media_caballero.avif',
    zapatos: '/zapatos_caballero.jpeg',
    'ropa-interior': '/ropa_interior_caballero.jpeg',
    'ropa-deportiva': '/ropa_deportiva_caballero.jpeg',
  },
  joven: {
    pantalones: '/pantalon_joven.jpeg',
    camisas: '/camisa_joven.jpg',
    chaquetas: '/chaqueta_joven.jpeg',
    sacos: '/saco_joven.jpeg',
    blusas: '/blusas_joven.jpeg',
    vestidos: '/vestido_joven.jpg',
    'ropa-deportiva': '/ropa_deportiva_joven.webp',
    corsets: '/corset_joven.jpeg',
    'ropa-interior': '/ropa_interior_joven.jpeg',
    medias: '/medias_joven.jpeg',
    zapatos: '/zapatos_joven.png',
  },
  nina: {
    pantalones: '/pantalon_niña.jpeg',
    camisas: '/camisa_niña.jpeg',
    chaquetas: '/chaqueta_niña.jpeg',
    sacos: '/saco_niña.jpeg',
    blusas: '/blusa_niña.webp',
    vestidos: '/vestido_niña.avif',
    'ropa-interior': '/ropa_interior_niña.jpeg',
    medias: '/medias_niña.jpeg',
    zapatos: '/zapatos_niña.jpeg',
  },
  nino: {
    pantalones: '/pantalon_niño.avif',
    zapatos: '/zapatos_niño.jpeg',
    camisas: '/camisa_niño.jpeg',
    sacos: '/saco_niño.jpeg',
    chaquetas: '/chaqueta_niño.jpeg',
    medias: '/medias_niño.jpeg',
    'ropa-interior': '/ropa_interior_niño.png',
  },
  accesorios: {
    gafas: '/gafas_accesorios.jpeg',
    relojeria: '/joyeria_accesorio.jpeg',
    joyeria: '/joyeria_accesorio.jpeg',
    tecnologia: '/tecnologia_accesorios.png',
  },
  edredones: {
    sabanas: '/sabana_edredones.png',
    almohadas: '/almohada_edredones.jpeg',
    cobijas: '/cobijas_edredones.jpeg',
    cubrelechos: '/cubrelecho_edredones.png',
    fundas: '/fundas_edredones.png',
  },
}

export default function SubsectionCard({ subsection, sectionSlug }: { subsection: Subsection; sectionSlug: string }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageUrl = useMemo(() => {
    const sectionImages = imagesBySlug[sectionSlug]
    return sectionImages?.[subsection.slug] || subsection.image_url
  }, [sectionSlug, subsection.slug, subsection.image_url])

  const hasImage = Boolean(imageUrl) && !imageError

  return (
    <Link
      href={`/${sectionSlug}/${subsection.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-[#DCEFDD] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#FAFCF9]">
        {hasImage ? (
          <>
            <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={imageUrl!}
                alt={subsection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
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

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F2A1A]/90 via-[#0F2A1A]/55 to-transparent p-4 sm:p-5">
        <p className="font-serif text-base font-semibold text-white">{subsection.name}</p>
        {subsection.description && <p className="mt-1 text-sm text-white/80 line-clamp-2">{subsection.description}</p>}
      </div>
    </Link>
  )
}
