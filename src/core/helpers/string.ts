import { QueryState } from "../model"
import qs from 'qs'


/**
 * Checks if a value is not undefined, not null, and not an empty string.
 *
 * @param {unknown} obj - The value to check for emptiness.
 * @returns {boolean} Returns true if the value is not undefined, not null, and not an empty string; otherwise, returns false.
 */
export const isNotEmpty = (obj: unknown) => {
  return obj !== undefined && obj !== null && obj !== ''
}


/**
 * Converts a QueryState object into a URL query string, processing pagination, sorting, filtering, and a key.
 *
 * Example: page=1&items_per_page=10&sort=id&order=desc&search=a&filter_name=a&filter_online=false
 * @param {QueryState} state - An object representing the query state, containing properties like pagination, sorting, filtering, and a key.
 * @returns {string} Returns a URL query string constructed from the provided QueryState.
 */
export const stringifyRequestQuery = (state: QueryState): string => {
  const pagination = qs.stringify(state, {filter: ['page', 'items_per_page'], skipNulls: true})
  const sort = qs.stringify(state, {filter: ['sort', 'order'], skipNulls: true})
  const key = isNotEmpty(state.key) ? qs.stringify(state, {filter: ['key'], skipNulls: true}) : ''

  const filter = state.filter
    ? Object.entries(state.filter as Object)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => {
          return `filter_${obj[0]}=${obj[1]}`
        })
        .join('&')
    : ''

  return [pagination, sort, key, filter]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}