/* eslint-disable react-hooks/exhaustive-deps */
import {ForwardedRef, ReactElement, createContext, forwardRef, useContext, useImperativeHandle, useState} from 'react'
import {QueryState, initialQueryState} from '../model'



type UpdateState = (updates: Partial<QueryState>) => void


/**
 * Context props for the Query request.
 *
 * @property {QueryState} [state] - The state for handling data change
 * @property {(updates: Partial<QueryState>) => void} [updatedState] - Function handling update state
 */
interface QueryRequestContextProps {
  state: QueryState
  updateState: UpdateState
}


/**
 * Props component for the QueryRequestProvider.
 *
 * @property {ReactElement} [children] - The children component
 */
interface QueryRequestProviderProps {
  children: ReactElement
}


/**
 * QueryRequestProviderRef type for ref will can forwared to parent
 * 
 * @property {QueryState} [query]
 * @property {UpdateState} [updateQuery]
 */
interface QueryRequestProviderRef {
  query: QueryState
  updateQuery: UpdateState
}


/**
 * Initial variabel for component QueryRequestProvider
 */
const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}


/**
 * Context for the QueryRequestProvider.
 */
const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)


/**
 * Custom hook for access the QueryRequest context.
 *
 * @returns {QueryRequestContextProps} The Query request context.
 */
const useQueryRequestProvider = () => useContext<QueryRequestContextProps>(QueryRequestContext)


/**
 * Query Request Provider.
 * This component will handling with state will usage for query params.
 * State query will handling like pagination, sort, and another custom
 * state will action for this table.
 *
 * @param param0 - Params with type QueryRequestProviderProps
 * @returns {ReactElement}
 */
const QueryRequestProvider = forwardRef<QueryRequestProviderRef, QueryRequestProviderProps>(
  ({ children }: QueryRequestProviderProps, ref: ForwardedRef<QueryRequestProviderRef>) => {
    const [state, setState] = useState<QueryState>(initialQueryState)

  
    const updateState = (updates: Partial<QueryState>) => {
      const updatedState = {...state, ...updates} as QueryState
      setState(updatedState)
    }


    useImperativeHandle(ref, () => ({
      query: state,
      updateQuery: updateState
    }))


    return (
      <QueryRequestContext.Provider value={{state, updateState}}>
        {children}
      </QueryRequestContext.Provider>
    )
  }
)

export {
  initialQueryRequest, 
  useQueryRequestProvider, 
  type QueryRequestContextProps,
  type QueryRequestProviderRef
}
export default QueryRequestProvider
