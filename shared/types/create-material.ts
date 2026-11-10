import type { OutputData } from '@editorjs/editorjs'

export type MaterialDocument = OutputData

export interface CreateMaterialPayload {
  title: string
  short_description: string
  datetime: string
  description_html: string
  description_json: MaterialDocument
}

export interface CreateMaterialResult {
  success: true
  id: string
}
