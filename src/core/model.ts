export type ID = undefined | null | number | string
export type Links = {label: string; active: boolean; url: string | null; page: number | null}
export type ItemPerPage = 3 | 10 | 30 | 50 | 100

export type PaginationState = {
  page: number
  items_per_page: ItemPerPage
  links?: Array<Links>
  total_items: number
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  key?: string
}

export type ResponseServerData<T> = {
  current_page: number
  links: any[]
  per_page: number
  total: number
  data: T[]
}

export type ResponseServer<T> = Payload & {
  status: boolean
  data: ResponseServerData<T>
}

export type Payload = {
  message?: string
  errors?: {
    [key: string]: Array<string>
  }
  pagination?: PaginationState
}

export type Response<T> = {
  data?: T[]
  payload?: Payload
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export interface FetchDataParams {
  query?: string
  [key: string]: string | undefined
}

export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
  total_items: 0
}