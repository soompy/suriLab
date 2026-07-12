export function createTaxonomySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function findNameBySlug(names: string[], slug: string) {
  return names.find((name) => createTaxonomySlug(name) === slug) || null
}
