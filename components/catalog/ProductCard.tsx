import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductCard({ product, href }: { product: Product; href: string }) {
  const image = product.images?.[0]
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] bg-green-50 rounded-2xl overflow-hidden mb-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="50vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-green-200 text-xs">Sin imagen</div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-green-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">Destacado</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/10 group-hover:to-transparent transition-all duration-300" />
      </div>
      <p className="text-sm font-medium text-green-900 leading-tight line-clamp-2 group-hover:text-green-700 transition-colors duration-200">{product.name}</p>
      {product.price !== null && <p className="text-sm text-green-600 mt-0.5 font-semibold">{formatPrice(product.price)}</p>}
      <div className="flex gap-1 mt-1 flex-wrap">
        {product.sizes.slice(0, 4).map((s) => (
          <span key={s} className="text-[10px] border border-green-200 rounded-lg px-1.5 py-0.5 text-green-600 bg-green-50/50">{s}</span>
        ))}
      </div>
    </Link>
  )
}
