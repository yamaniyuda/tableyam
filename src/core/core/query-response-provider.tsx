/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dispatch,
  ForwardRefExoticComponent,
  ForwardedRef,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {PaginationState, Response, initialQueryState} from '../model'
import {useQueryRequestProvider} from './query-request-provider'
import {useTableProvider} from './table-provider'
import {useQuery} from 'react-query'
import {explodeQuery, refactoryDataStructTable} from '../helpers/object'



/**
 * Context props for Query Response
 *
 * @property {boolean} [isLoading] - The state for handling loading state
 * @property {string} [query] - The query
 */
interface QueryResponseContextProps<T> {
  isLoading: boolean
  query: string
  setQuery: Dispatch<SetStateAction<string>>
  response?: Response<Array<T>>
  refetch: () => void
}


/**
 * Type or ref query response provider.
 * 
 * @property {Function} [refetch] - The refetch data from table
 */
interface QueryResponseProviderRef {
  refetch: Function
}



/**
 * Props component for the QueryResponseProvider.
 *
 * @property {ReactElement} [children] - The children component
 */
interface QueryResponseProviderProps {
  children: ReactElement
}



interface QueryResponseProviderComponent
  extends ForwardRefExoticComponent<
    PropsWithoutRef<QueryResponseProviderProps> & RefAttributes<QueryResponseProviderRef>
  > {}



/**
 * Initial variabel for QueryResponseContext
 */
const initialQueryResponse: QueryResponseContextProps<any> = {
  isLoading: false,
  query: '',
  setQuery: () => {},
  refetch: () => {},
}



/**
 * Context for the QueryResponse
 */
const QureyResponseContext = createContext<QueryResponseContextProps<any>>(initialQueryResponse)



/**
 * Custom hook for access the query response context.
 * @returns {QueryResponseContextProps} The Query Response Context.
 */
const useQueryResponseProvider = () =>
  useContext<QueryResponseContextProps<any>>(QureyResponseContext)



const useQueryResponseData = () => {
  const {response} = useQueryResponseProvider()
  if (!response) return []

  return response?.data || []
}



/**
 * Custom hook for access pagination state.
 * @returns {PaginationState}
 */
const useQueryResponsePagination = (): PaginationState => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }

  const {response} = useQueryResponseProvider()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }

  return response.payload.pagination
}



/**
 * Custom hook for get state loading from Query Response
 * @returns {boolean}
 */
const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponseProvider()
  return isLoading
}



/**
 * Query Response Provider.
 *
 * @param param0
 * @returns {ReactElement}
 */
const QueryResponseProvider: QueryResponseProviderComponent = forwardRef<QueryResponseProviderRef, QueryResponseProviderProps>(
  ({children}: QueryResponseProviderProps, ref: ForwardedRef<QueryResponseProviderRef>) => {
    // const tableProvider: string = 'table-provider'
    const {state} = useQueryRequestProvider()
    const {dataPromise, fetchDataPromise, name} = useTableProvider()
    const [query, setQuery] = useState(name + '|' + new URLSearchParams(state as {}).toString())

  
    const updateQuery = useMemo(() => {
      let newParams = new URLSearchParams(state as {}).toString()
      const newState = `${name}|${newParams}`
      return newState
    }, [state])
  
  

    /**
     * Query Fetch Data Handler.
     * This function usage for handling data promise for use query.
     * @returns {Promise<Response<any[]>>}
     */
    const queryFetchDataHandler = (): Promise<Response<any[]>> => {
      const queryObject = explodeQuery(query.split('|')[1])
      return new Promise(async (resolve) => {
        let result: Response<any[]>
  
        if (fetchDataPromise !== undefined) {
          result = await fetchDataPromise!({query, ...queryObject}).then((res) => {
            return refactoryDataStructTable({
              data: res,
              query,
            })
          })
        } else {
          result = refactoryDataStructTable({
            data: await dataPromise!,
            query,
          })
        }
  
        resolve(result)
      })
    }
  

  
    /* fetch or not data handling */
    const {
      refetch,
      isFetching,
      data: response,
    } = useQuery<Response<any[]>>([query], queryFetchDataHandler, {
      cacheTime: 0,
      keepPreviousData: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    })
  
  
  
    useEffect(() => {
      refetch()
    }, [dataPromise])
  
  
  
    /**
     * This use effect usage for handling
     * state change from parent component
     */
    useEffect(() => {
      if (query !== updateQuery) {
        setQuery(updateQuery)
      }
    }, [updateQuery])



    useImperativeHandle(ref, () => ({refetch}))
  

  
    return (
      <QureyResponseContext.Provider value={{isLoading: isFetching, refetch, query, response, setQuery}}>
        {children}
      </QureyResponseContext.Provider>
    )
  }
)


export {
  useQueryResponseData,
  useQueryResponseProvider,
  useQueryResponsePagination,
  useQueryResponseLoading,
  type QueryResponseProviderProps,
  type QueryResponseContextProps,
  type QueryResponseProviderRef
}
export default QueryResponseProvider
