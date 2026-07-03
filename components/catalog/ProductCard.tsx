import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

type ProductCardProps = {
  product: Product
  href: string
  adminMode?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export default function ProductCard({ product, href, adminMode, onEdit, onDelete }: ProductCardProps) {
  const image = product.images?.[0]
  const otherImages = product.images?.slice(1, 4) ?? []
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const hasImage = Boolean(image) && !imageError

  const cardContent = (
    <div className="overflow-hidden rounded-2xl border border-[#DCEFDD] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
      <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-[#FAFCF9]">
        {hasImage ? (
          <>
            <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={image!}
                alt={product.name}
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
        {product.is_featured && (
          <span className="absolute left-3 top-3 rounded-full border border-[#6FCB8C] bg-[rgba(95,190,123,0.12)] px-3 py-1 text-[10px] font-semibold text-[#1F6B3C] shadow-sm">
            Destacado
          </span>
        )}
      </div>

      {otherImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2 px-3 pb-3">
          {otherImages.map((src, index) => (
            <div key={index} className="relative h-16 overflow-hidden rounded-2xl border border-[#E5EEE7] bg-[#F8FBF7]">
              <Image
                src={src}
                alt={`${product.name} variante ${index + 2}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-4">
        <p className="text-base font-serif font-semibold leading-tight text-[#0F2A1A] line-clamp-2 transition-colors duration-300 group-hover:text-[#3E9A60]">{product.name}</p>
        {adminMode && product.price !== null && <p className="mt-2 text-lg font-medium text-[#1F6B3C]">{formatPrice(product.price)}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 4).map((size) => (
            <span key={size} className="rounded-full border border-[#DCEFDD] bg-white px-2 py-1 text-[10px] text-[#0F2A1A]">{size}</span>
          ))}
        </div>

        {adminMode && (onEdit || onDelete) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  onEdit(product)
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#3E9A60] bg-[#EAF8EC] px-3 py-2 text-xs font-semibold text-[#1F6B3C] transition hover:bg-[#D7F5D8]"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  onDelete(product)
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#B12A1B] bg-[#FCE8E7] px-3 py-2 text-xs font-semibold text-[#9C1F1F] transition hover:bg-[#F9D7D4]"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Link href={href} className="group block">
      {cardContent}
    </Link>
  )
}
