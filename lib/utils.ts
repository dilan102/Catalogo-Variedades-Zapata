export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'Consultar precio'
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price)
}

export function generateSlug(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export async function parseJsonResponse<T = Record<string, unknown>>(response: Response): Promise<T> {
  const text = await response.text()

  if (!text) {
    return {} as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    const preview = text.replace(/\s+/g, ' ').trim().slice(0, 180)
    throw new Error(preview ? `Respuesta inválida del servidor: ${preview}` : 'La respuesta del servidor no fue válida.')
  }
}
