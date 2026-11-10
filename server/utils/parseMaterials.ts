import { sanitizeDescription } from './sanitizeDescription'
import type { Material } from '../../shared/types/material'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseMaterials(value: unknown): Material[] {
  if (!Array.isArray(value)) {
    throw new Error('Expected an array of materials')
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`Invalid material at index ${index}`)
    }

    const {
      id,
      title,
      short_description,
      datetime,
      description_html,
    } = item

    const isValidId =
      (typeof id === 'string' && id.trim().length > 0) ||
      (typeof id === 'number' && Number.isSafeInteger(id))

    if (
      !isValidId ||
      typeof title !== 'string' ||
      typeof short_description !== 'string' ||
      typeof datetime !== 'string' ||
      typeof description_html !== 'string'
    ) {
      throw new Error(`Invalid material fields at index ${index}`)
    }

    return {
      id: String(id),
      title,
      short_description,
      datetime: normalizeApiDatetime(datetime),
      description_html: sanitizeDescription(description_html),
    }
  })
}

function normalizeApiDatetime(value: string): string {
  const isSqlDatetime = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
  const normalized = isSqlDatetime
    ? value.replace(' ', 'T') + 'Z'
    : value
  const date = new Date(normalized)

  if (!Number.isFinite(date.getTime())) {
    throw new Error('Invalid material datetime')
  }

  if (isSqlDatetime && date.toISOString().slice(0, 19) !== normalized.slice(0, 19)) {
    throw new Error('Invalid material datetime')
  }

  return date.toISOString()
}
