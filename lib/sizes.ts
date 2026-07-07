export function getAvailableSizes(sectionSlug: string, subsectionSlug: string): string[] {
  const adultClothingSections = ['dama', 'caballero']
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

  if (sectionSlug === 'dama' && subsectionSlug === 'pantalones') {
    return ['6', '8', '10', '12', '14', '16', 'S', 'M', 'L', 'Plus', 'Única']
  }

  if (sectionSlug === 'caballero' && subsectionSlug === 'pantalones') {
    return ['24', '26', '28', '30', '32', '34', '36', '38', 'Plus', 'Única']
  }

  if (adultClothingSections.includes(sectionSlug)) {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Plus', 'Única']
  }

  if (kidClothingSections.includes(sectionSlug)) {
    return ['0', '2', '4', '6', '8', '10', '12', '14', '16']
  }

  return []
}
