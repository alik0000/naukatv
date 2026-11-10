import type { Material } from '../../shared/types/material'

export const useMaterials = () => {
  return useFetch<Material[]>('/api/materials', {
    key: 'materials',
    default: () => [],
  })
}
