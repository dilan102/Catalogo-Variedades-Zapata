export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-green-100 rounded-xl mb-2" />
      <div className="h-3.5 bg-green-100 rounded w-3/4 mb-1" />
      <div className="h-3 bg-green-100 rounded w-1/3" />
    </div>
  )
}
export function SectionCardSkeleton() {
  return <div className="aspect-square bg-green-100 rounded-2xl animate-pulse" />
}
