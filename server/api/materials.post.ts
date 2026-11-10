import type {
  CreateMaterialResult,
} from '../../shared/types/create-material'
import { parseCreateMaterial } from '../utils/parseCreateMaterial'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export default defineEventHandler(
  async (event): Promise<CreateMaterialResult> => {
    const config = useRuntimeConfig(event)

    const body: unknown = await readBody(event)
    const payload = parseCreateMaterial(body)

    const baseUrl = config.materialsApiBase.replace(/\/+$/, '')
    const alias = encodeURIComponent(config.materialsApiAlias)

    let response: unknown

    try {
      response = await $fetch<unknown>(`${baseUrl}/${alias}/save`, {
        method: 'POST',
        body: payload,
        timeout: 15_000,
        retry: 0,
      })
    } catch (error: unknown) {
      const statusCode = isRecord(error)
        ? error.statusCode ?? error.status
        : undefined

      // Preserve an explicit business validation refusal from the upstream API.
      if (statusCode === 422) {
        throw createError({
          statusCode: 422,
          message: 'Сервер отклонил сохранение материала.',
        })
      }

      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to save material',
        message:
          'Не удалось подтвердить сохранение. Проверьте список перед повторной отправкой.',
      })
    }

    if (!isRecord(response) || typeof response.success !== 'boolean') {
      throw createError({
        statusCode: 502,
        message:
          'Получен неизвестный ответ сервера. Проверьте список перед повторной отправкой.',
      })
    }

    if (!response.success) {
      throw createError({
        statusCode: 422,
        message: 'Сервер отклонил сохранение материала.',
      })
    }

    const id = response.id

    const isValidId =
      (typeof id === 'number' && Number.isSafeInteger(id)) ||
      (typeof id === 'string' && id.trim().length > 0)

    if (!isValidId) {
      throw createError({
        statusCode: 502,
        message:
          'Сервер подтвердил сохранение, но не вернул корректный ID. Проверьте список материалов.',
      })
    }

    return {
      success: true,
      id: String(id),
    }
  },
)
