import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Leaf } from 'lucide-react'
import type { Product } from '@/types'

export default function ProductCard({ product, href }: { product: Product; href: string }) {
  const image = product.images?.[0]
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="50vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#5C7A66]/30 text-xs">Sin imagen</div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-[rgba(95,190,123,0.12)] border border-[#6FCB8C] text-[#1F6B3C] text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Leaf size={10} />
            Destacado
          </span>
        )}
      </div>
      <p className="text-base font-serif font-semibold text-[#0F2A1A] leading-tight line-clamp-2 group-hover:text-[#3E9A60] transition-colors duration-300">{product.name}</p>
      {product.price !== null && <p className="text-lg text-[#1F6B3C] mt-2 font-medium">{formatPrice(product.price)}</p>}
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {product.sizes.slice(0, 4).map((s) => (
          <span key={s} className="text-[10px] border border-[#DCEFDD] rounded-full px-2 py-1 text-[#0F2A1A] bg-white">{s}</span>
        ))}
      </div>
    </Link>
  )
}
