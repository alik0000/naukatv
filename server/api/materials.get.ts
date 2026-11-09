import { parseMaterials } from '../utils/parseMaterials'
import type { Material } from '../../shared/types/material'

export default defineEventHandler(
  async (event): Promise<Material[]> => {
    const config = useRuntimeConfig(event)

    const baseUrl = config.materialsApiBase.replace(/\/+$/, '')
    const alias = encodeURIComponent(config.materialsApiAlias)

    let response: unknown

    try {
      response = await $fetch<unknown>(`${baseUrl}/${alias}`, {
        timeout: 10_000,
        retry: 0,
      })
    } catch {
      throw createError({
        statusCode: 502,
        statusMessage: 'Failed to load materials',
        message: 'Не удалось получить материалы. Попробуйте ещё раз.',
      })
    }

    try {
      return response as Material[] //::TODO исправить
    } catch {
      throw createError({
        statusCode: 502,
        statusMessage: 'Invalid materials response',
        message: 'Сервис материалов вернул некорректные данные.',
      })
    }
  },
)
