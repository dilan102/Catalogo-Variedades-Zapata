export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-200 rounded-xl mb-2" />
      <div className="h-3.5 bg-stone-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-stone-200 rounded w-1/3" />
    </div>
  )
}

export function SectionCardSkeleton() {
  return (
    <div className="aspect-square bg-stone-200 rounded-2xl animate-pulse" />
  )
}
