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
        message: 'Не удалось получить материалы!',
      })
    }

    try {
      return response as Material[] //::TODO исправить
    } catch {
      throw createError({
        statusCode: 502,
        message: 'Некорректные данные!',
      })
    }
  },
)
