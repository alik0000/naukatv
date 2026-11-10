import { createError } from 'h3'
import { editorToHtml } from '../../shared/utils/editor'
import { sanitizeDescription, sanitizeInline } from './sanitizeDescription'
import type { OutputData } from '@editorjs/editorjs'
import type {
  CreateMaterialPayload,
} from '../../shared/types/create-material'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function invalidField(message: string): never {
  throw createError({
    statusCode: 422,
    message,
  })
}

export function parseCreateMaterial(
  value: unknown,
): CreateMaterialPayload {
  if (!isRecord(value)) {
    throw createError({
      statusCode: 400,
      message: 'Некорректное тело запроса.',
    })
  }

  const {
    title,
    short_description,
    datetime,
    description_html,
    description_json,
  } = value

  if (typeof title !== 'string' || !title.trim() || title.length > 80) {
    invalidField('Введите заголовок длиной от 1 до 80 символов.')
  }

  if (
    typeof short_description !== 'string' ||
    short_description.length > 255
  ) {
    invalidField('Краткое описание должно содержать не более 255 символов.')
  }

  if (
    typeof datetime !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(datetime)
  ) {
    invalidField('Дата должна быть в формате YYYY-MM-DDTHH:mm:ss.sssZ.')
  }

  const date = new Date(datetime)

  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString() !== datetime
  ) {
    invalidField('Указана некорректная дата.')
  }

  if (typeof description_html !== 'string') {
    invalidField('HTML материала должен быть строкой.')
  }

  if (
    !isRecord(description_json) || !Array.isArray(description_json.blocks)
  ) {
    invalidField('Некорректный JSON документа.')
  }

  const blocks = description_json.blocks.map((block: unknown) => {
    if (!isRecord(block) || !isRecord(block.data)) invalidField('Некорректный блок редактора.')
    const { type, data } = block
    if (!['paragraph', 'header', 'quote'].includes(String(type)) || typeof data.text !== 'string') {
      invalidField('Неподдерживаемый блок редактора.')
    }
    if (type === 'header' && (typeof data.level !== 'number' || ![1, 2, 3].includes(data.level))) {
      invalidField('Допустимы заголовки h1–h3.')
    }
    if (type === 'quote' && (
      (data.caption !== undefined && typeof data.caption !== 'string') ||
      (data.alignment !== undefined && !['left', 'center'].includes(String(data.alignment)))
    )) invalidField('Некорректная цитата.')

    return {
      ...(typeof block.id === 'string' ? { id: block.id } : {}),
      type: String(type),
      data: {
        text: sanitizeInline(data.text),
        ...(type === 'header' ? { level: Number(data.level) } : {}),
        ...(type === 'quote' ? { caption: sanitizeInline(String(data.caption ?? '')), alignment: data.alignment ?? 'left' } : {}),
      },
    }
  })
  const document: OutputData = {
    blocks,
    ...(typeof description_json.time === 'number' && Number.isFinite(description_json.time) ? { time: description_json.time } : {}),
    ...(typeof description_json.version === 'string' ? { version: description_json.version } : {}),
  }

  return {
    title: title.trim(),
    short_description,
    datetime,
    description_html: sanitizeDescription(editorToHtml(document)),
    description_json: document,
  }
}
