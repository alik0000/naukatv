export interface MaterialListItem {
  id: string
  title: string
  short_description: string
  datetime: string
}

export interface Material extends MaterialListItem {
  description_html: string
}
