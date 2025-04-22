import type { CategoryWithData, StatTabSlug } from '~/components/stat/types'
import type { TrnType } from '~/components/trns/types'

export function sortCategoriesByAmount(a: CategoryWithData, b: CategoryWithData) {
  if (!a || !b)
    return 0

  if (a.value === 0)
    return 1
  if (b.value === 0)
    return -1

  const isP = a.value > 0 && b.value > 0
  const isN = a.value < 0 && b.value < 0

  if (isP)
    return b.value - a.value
  if (isN)
    return a.value - b.value
  return a.value > 0 ? -1 : 1
}

export function getTypesMapping(slug: StatTabSlug): TrnType[] | undefined {
  const typeMapping: Record<StatTabSlug, TrnType[]> = {
    expense: [0, 2],
    income: [1, 2],
    split: [0, 1, 2],
    summary: [0, 1, 2],
  }
  const trnsTypes = typeMapping[slug]

  return trnsTypes ?? [0, 1, 2]
}
