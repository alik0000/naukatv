import sanitizeHtml from 'sanitize-html'

export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'blockquote', 'cite', 'br', 'b',
      'i', 'strong', 'em', 's', 'u', 'ul', 'ol', 'li', 'a', 'hr', 'pre', 'code'],
    allowedAttributes: { a: ['href', 'title'], blockquote: ['class'] },
    allowedClasses: { blockquote: ['quote-center'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}

export function sanitizeInline(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['br', 'b', 'i', 'strong', 'em', 's', 'u', 'a'],
    allowedAttributes: { a: ['href', 'title'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  })
}
