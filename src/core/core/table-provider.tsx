import {
  ForwardRefExoticComponent,
  ForwardedRef,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react'
import {FetchDataParams} from '../model'
import QueryRequestProvider, { QueryRequestProviderRef } from './query-request-provider'
import QueryResponseProvider, { QueryResponseProviderRef } from './query-response-provider'
import Table, { TableProviderRef as TableComponentProviderRef } from '../components/table'

/**
 * Menu Context Props
 *
 * @property {(value: any, query: string) => ReactElement} single - A element when row single
 * @property {(value: any[], query: string) => ReactElement} multiple - A element when row multiple active
 */
interface MenuContextProps {
  single?: (value: any, query: string) => ReactElement
  multiple?: (value: any[], query: string) => ReactElement
}



interface TableProviderRef {
  clearSelected: Function
  queryTable: {[key: string]: any}
  setQuery: (value: Object) => void
  refetch: Function
}



/**
 * Props wraping.
 *
 * @template T - The type of data to be displayed in the table.
 * @property {string} name - A name used for naming cached data.
 * @property {ReactElement[]} children - Children components inside the Table component, typically TableColumn.
 * @property {T[]} [dataPromise] - Raw data for the table (non-paginated).
 * @property {boolean} [showActionButton] - Determines whether to show an action button.
 * @property {(data: T) => void} [onClickRow] - Optional handler for the row click event.
 * @property {(params: FetchDataParams) => Promise<ResponseServer<T>>} [fetchDataPromise] - Raw data with pagination.
 * @property {(data: T) => ReactElement[]} [actionButtonChildren] - Custom components or actions for action buttons.
 */
interface Props<T> {
  name: string
  credentialsName?: string
  dataPromise?: Promise<any[]>
  showActionButton?: boolean
  actionWidth?: number
  selectedRow?: boolean
  heightRow?: string
  menuContext?: MenuContextProps
  onSelectedRow?: (data: {countChoose: string[]; query: string}) => void
  onClickRow?: (data: {origin: T; currentIndex: number}) => void
  fetchDataPromise?: (params: FetchDataParams) => Promise<T[]>
  actionButtonChildren?: (data: T) => ReactElement[]
  customActionsCell?: (data: T, query: string) => ReactElement
}



/**
 * Props for wrapping a Table component.
 *
 * @template T - The type of data to be displayed in the table.
 */
interface TableProps extends Props<any> {
  children: ReactElement[]
}



/**
 * Context props for the Table context.
 *
 * @property {string} name - The name associated with the table context.
 */
interface TableContextProps extends Props<any> {}



interface TableProviderProps
  extends ForwardRefExoticComponent<
    PropsWithoutRef<TableProps> & RefAttributes<TableProviderRef>
  > {}



/**
 * Context for the Table component.
 */
const TableContext = createContext<TableContextProps>({
  name: '',
  selectedRow: false,
})



/**
 * Custom hook to access the Table context.
 * @returns {TableContextProps} The Table context.
 */
const useTableProvider = () => useContext(TableContext)



/**
 * Table Provider Component
 *
 * This component provides context for the Table component.
 *
 * @component
 * @param {TableProps<any>} props - The props for the TableProvider component.
 * @returns {ReactElement} A React element representing the TableProvider.
 *
 * @exampleS
 * <TableProvider name="ExampleTable">
 *   { component }
 * </TableProvider>
 */
const TableProvider: TableProviderProps = forwardRef<TableProviderRef, TableProps>(
  (props: TableProps, ref: ForwardedRef<TableProviderRef>): ReactElement => {
    const {name, children, ...prps} = props
    const queryResponseProviderRef = useRef<QueryResponseProviderRef>(null)
    const queryRequestProviderRef = useRef<QueryRequestProviderRef>(null) 
    const tableComponentRef = useRef<TableComponentProviderRef>(null)



    useImperativeHandle(ref, () => ({
      clearSelected: tableComponentRef.current?.setRowSelectedClear,
      queryTable: queryRequestProviderRef.current?.query,
      setQuery: queryRequestProviderRef.current?.updateQuery,
      refetch: queryResponseProviderRef.current.refetch
    }))

    
    
    return (
      <TableContext.Provider value={{...prps, name }} >
        <QueryRequestProvider ref={queryRequestProviderRef}>
          <QueryResponseProvider ref={queryResponseProviderRef}>
            <Table ref={tableComponentRef}>{children}</Table>
          </QueryResponseProvider>
        </QueryRequestProvider>
      </TableContext.Provider>
    )
  }
)

export {
  TableContext,
  useTableProvider,
  type TableContextProps,
  type TableProps,
  type TableProviderRef,
  type MenuContextProps,
  type TableProviderProps,
}
export default TableProvider
