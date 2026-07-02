export function getAvailableSizes(sectionSlug: string, subsectionSlug: string): string[] {
  const adultClothingSections = ['dama', 'caballero', 'joven']
  const kidClothingSections = ['nino', 'nina']
  const isShoes = subsectionSlug === 'zapatos'

  if (isShoes) {
    if (adultClothingSections.includes(sectionSlug)) {
      return Array.from({ length: 44 - 34 + 1 }, (_, index) => String(34 + index))
    }

    if (kidClothingSections.includes(sectionSlug)) {
      return Array.from({ length: 33 - 18 + 1 }, (_, index) => String(18 + index))
    }

    return []
  }

  if (adultClothingSections.includes(sectionSlug)) {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  }

  if (kidClothingSections.includes(sectionSlug)) {
    return ['0', '2', '4', '6', '8', '10', '12', '14', '16']
  }

  return []
}
