import {Pagination} from 'src/app/types/api'
import {ItemPerPage, Links, Payload, Response, ResponseServer} from '../model'

/**
 * Params type for feractoryFetch function
 */
export type refactoryFetchProps = {
  data: any[] | ResponseServer<any>
  query?: string
}

/**
 * This function is used to truncate array data by wish
 *
 * @param {Array<any>} data - data array for cutter
 * @param {number} chunkSize - length array for cutting
 * @returns
 */
export const explodeArray = (data: Array<any>, chunkSize: number) => {
  const result = []
  const totalChunks = Math.ceil(data.length / chunkSize)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    const chunk = data.slice(start, end)
    result.push(chunk)
  }

  return result
}

/**
 * Explode Query.
 * This function usage for explode query string to object
 *
 * example:
 *  page=2&size=10 --> {page: 2, size: 10}
 *
 * @param {string} query
 * @returns {[key: string]: any}
 */
export const explodeQuery = (query: string): {[key: string]: any} => {
  const queryNames = query.split('&')
  const buildQueryObj = {}

  queryNames.forEach((data) => {
    const keyValue = data.split('=')
    Object.assign(buildQueryObj, {[keyValue[0]]: keyValue[1]})
  })

  return buildQueryObj
}

/**
 * This function use for payload makker
 *
 * @param {number} dataSize - size of data
 * @param {number} currentPage - current state page
 * @param {number} chuckSize - size array
 * @return {Payload}
 */
export const payloadMakker = (
  dataSize: number,
  currentPage: number,
  chuckSize: ItemPerPage,
  dataLength: number
): Payload => {
  const linkWrap: Array<Links> = []

  // Previous page link
  linkWrap.push({
    url: currentPage === 1 ? null : `/?page=${currentPage - 1}`,
    label: 'Previous',
    active: currentPage > 1,
    page: currentPage > 1 ? currentPage - 1 : 1,
  })

  // Page number links
  for (let i = 1; i <= dataSize; i++) {
    linkWrap.push({
      url: `/?page=${i}`,
      label: `${i}`,
      active: i === currentPage,
      page: i,
    })
  }

  // Next page link
  linkWrap.push({
    url: `/?page=${currentPage + 1}`,
    label: 'Next',
    active: currentPage < dataSize,
    page: currentPage < dataSize ? currentPage + 1 : dataSize,
  })

  return {
    pagination: {
      items_per_page: chuckSize,
      page: currentPage,
      links: linkWrap,
      total_items: dataLength,
    },
  }
}

/**
 * For refactoring server response when there's no pagination.
 *
 * @template T - The data type of the response data.
 * @param {(query?: string) => Promise<any>} data - this is function normal fetch
 * @return {Promise<ResponseServer<Array>>}
 */
export const refactoryDataStructTable = <T>({
  data,
  query,
}: refactoryFetchProps): Response<Array<T>> => {

  if (data instanceof Array) {
    let queryParams: any = new URLSearchParams(query.split('|')[1])
    queryParams = Object.fromEntries(queryParams)

    const pageAndDelimiter = {
      page: parseInt(queryParams?.page ?? '1'),
      items_per_page: parseInt(queryParams?.items_per_page ?? '10')
    }

    const newWrap = explodeArray(data, pageAndDelimiter.items_per_page!)
    const payload = payloadMakker(
      newWrap.length,
      pageAndDelimiter.page!,
      pageAndDelimiter.items_per_page! as ItemPerPage,
      data.length
    )


    return {
      data: newWrap[pageAndDelimiter!.page! - 1],
      payload: payload,
    }
  }


  const convertType = data as unknown as Pagination<any>

  return {
    data: Object.values(convertType.data) as any[],
    payload: {
      pagination: {
        links: convertType.links as any,
        items_per_page: convertType.per_page as ItemPerPage,
        page: convertType.current_page,
        total_items: convertType.total,
      },
    },
  }
}
