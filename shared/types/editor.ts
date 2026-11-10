import type { OutputData } from '@editorjs/editorjs'

export interface MaterialEditorHandle {
  save: () => Promise<OutputData>
}
