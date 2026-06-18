import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductCard({ product, href }: { product: Product; href: string }) {
  const image = product.images?.[0]
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] bg-green-50 rounded-3xl overflow-hidden mb-4 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-115" sizes="33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-green-200 text-xs font-serif italic">Sin imagen</div>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-semibold px-3 py-1 rounded-full shadow-md font-serif italic">Destacado</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/10 group-hover:to-transparent transition-all duration-500" />
      </div>
      <p className="text-base font-serif font-semibold text-green-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300 italic">{product.name}</p>
      {product.price !== null && <p className="text-lg text-emerald-700 mt-2 font-bold font-serif italic">{formatPrice(product.price)}</p>}
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {product.sizes.slice(0, 4).map((s) => (
          <span key={s} className="text-[10px] border border-green-200 rounded-full px-2 py-1 text-green-600 bg-green-50 font-serif italic">{s}</span>
        ))}
      </div>
    </Link>
  )
}
