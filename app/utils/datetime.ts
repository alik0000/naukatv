export function toLocalDatetimeInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')

  const year = String(date.getFullYear()).padStart(4, '0')
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function localDatetimeToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null
  }

  const date = new Date(value)

  if (
    !Number.isFinite(date.getTime()) ||
    toLocalDatetimeInput(date) !== value
  ) {
    return null
  }

  return date.toISOString()
}
