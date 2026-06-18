import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  product: Product
  href: string
}

export default function ProductCard({ product, href }: Props) {
  const image = product.images?.[0]

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden mb-2">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-active:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Destacado
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-stone-800 leading-tight line-clamp-2">{product.name}</p>
        {product.price !== null && (
          <p className="text-sm text-stone-500 mt-0.5">{formatPrice(product.price)}</p>
        )}
        {product.sizes.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-[10px] border border-stone-200 rounded px-1.5 py-0.5 text-stone-500">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
