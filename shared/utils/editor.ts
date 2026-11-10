import type { OutputData } from '@editorjs/editorjs'

export function editorToHtml(document: OutputData): string {
  return document.blocks.map(block => {
    const { text, level, caption, alignment } = block.data
    switch (block.type) {
      case 'paragraph':
        return `<p>${text}</p>`
      case 'header':
        if (![1, 2, 3].includes(level)) {
          throw new Error('Некорректный уровень заголовка.')
        }
        return `<h${level}>${text}</h${level}>`
      case 'quote':
        return `<blockquote${alignment === 'center' ? ' class="quote-center"' : ''}><p>${text}</p>${caption ? `<cite>${caption}</cite>` : ''}</blockquote>`
      default:
        throw new Error(`Неподдерживаемый блок редактора: ${block.type}`)
    }
  }).join('\n')
}
