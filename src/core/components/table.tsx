/* eslint-disable react-hooks/exhaustive-deps */
import {
  Children,
  ForwardRefExoticComponent,
  Fragment,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  createContext,
  createElement,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {ColumnProps} from './column'
import {Row, useTable} from 'react-table'
import {
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
  useQueryResponseProvider,
} from '../core/query-response-provider'
import {KTCard, KTCardBody} from 'src/_metronic/helpers'
import {ConditinalRendering} from 'src/app/widgets/molecule/conditional-rendering'
import {useTableProvider} from '../core/table-provider'
import ActionsCell from './action-cell'
import {CustomHeader} from './header/custom-header'
import {LoadingTable} from './loading-table'
import {ListPagination} from './list-pagination'
import {DataEmepty} from './data-emepty'
import {CustomRow} from './custom-row/custom-row'
import {MenuContext} from './custom-row/menu-context'
import {useContextMenu} from 'src/app/hook/use-context-menu'
import NumberCell from './numor-cell'
import useRowSelectController, { UseRowSelectControllerReturn } from '../hook/use-row-select-controller'
import { useStickyColumnPlugin } from '../hook/use-sticky-column-pluginx'
import TableStyled from './_table-styled'

/**
 * Props for Table Component.
 */
interface TableProps {
  children: ReactElement[] | any
}



/**
 * Type Table Context Props
 */
interface TableContextProps extends UseRowSelectControllerReturn {}



/**
 * Context Table
 */
const TableContext = createContext<TableContextProps>({
  currentSelected: [],
  setRowSelected: (value: string, type: 'add' | 'remove') => {},
  setRowSelectedClear: () => {},
})



/**
 * useTableComponent for get all state in table context.
 * @returns {TableContextProps}
 */
const useTableComponent = () => useContext(TableContext)



/**
 * Type for ref
 */
interface TableProviderRef extends UseRowSelectControllerReturn {}


/**
 * Table type forward component
 */
interface TableProviderComponent
  extends ForwardRefExoticComponent<
    PropsWithoutRef<TableProps> & RefAttributes<TableProviderRef>
  >{}


/**
 * Column configuration for a React table.
 */
const columnAdditional = {
  nomor: {
    Header: NumberCell.NumberHeader,
    Cell: NumberCell.NumberRow,
    id: NumberCell.Id,
  },
  action: {
    Header: ActionsCell.ActionHeader,
    Cell: ActionsCell.ActionsRow,
    id: ActionsCell.Id,
    width: '70px',
    sticky: 'right'
  },
}



/**
 * Table.
 * This component usage for table wraping
 *
 * @param param0 - Props for table component.
 * @returns {ReactElement}
 */
const Table: TableProviderComponent = forwardRef<TableProviderRef, TableProps>(
  ({children}, ref) => {
    const pagination = useQueryResponsePagination()
    const table = useRef<HTMLInputElement>(null)
    const dataRespnse = useQueryResponseData()
    const {query} = useQueryResponseProvider()
    const isLoading = useQueryResponseLoading()
    const {currentSelected, setRowSelected, setRowSelectedClear} = useRowSelectController()
    const {showActionButton, menuContext} = useTableProvider()
    const {clicked, setClicked, points, setPointes} = useContextMenu()
    const [valueContextMenu, setValueContextMenu] = useState<any>()


    const data = useMemo(
      () =>
        dataRespnse.map((d, i) => ({
          ...d,
          no: i + 1 + (pagination.page - 1) * pagination.items_per_page,
        })),
      [dataRespnse]
    )


    
    /**
     * This will extraxct all props from children and will rebuild to column
     * and header witih id, like native usage react-table
     */
    const extractedProps = Children.map(children, (child) => {
      if (isValidElement(child)) {
        const {id, headerClassName, children, headerName, ...props} = child.props as ColumnProps<any>
        return {
          Header: () => createElement('div', {
            className: headerClassName,
            children: createElement('span', { children: headerName })
          }),
          id: id,
          sticky: props.sticky,
          width: props.width  ,
          Cell: children,
        }
      }
    })



    extractedProps.unshift(columnAdditional.nomor)



    /**
     * This use effect usage for handling scroll and hidden action
     * shadow when scroll finished.
     * Scroll Event Handler
     * This function usage for handling scroll handling and do remove action
     * shadow
     */
    useEffect(() => {
      const customTable: HTMLInputElement | null = table.current
      const scrollEventHandler = (e: Event): void => {
        const columnSticky: NodeListOf<Element> = document.querySelectorAll('[data-sticky-first-right-td]')
        if (customTable!.scrollLeft + customTable!.clientWidth >= customTable!.scrollWidth) {
          columnSticky.forEach((element) => element.classList.remove('column-sticky'))
        } else {
          columnSticky.forEach((element) => {
            element.classList.add('column-sticky')
          })
        }
      }
      if (customTable) customTable.addEventListener('scroll', scrollEventHandler)
      return () => customTable?.removeEventListener('scroll', scrollEventHandler)
    }, [])



    /* add action cell when use */
    if (showActionButton) extractedProps.push(columnAdditional.action)
    const columns = useMemo(() => extractedProps, [])
    const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable<any>({
      columns,
      data,
    }, useStickyColumnPlugin)



    /**
     * onMenuContextHandler.
     * This usage for handling show or hide context menu. This context menu have 2 condition
     * when row in selected have diferrend ui when not in selected row
     * @param {x: number, y: number} e 
     * @param {any} value 
     */
    const onMenuContextHandler = (e: {x: number; y: number}, value: any) => {
      setClicked(!clicked)
      setPointes(e)
      setValueContextMenu(value)
    }
    


    /**
     * useImperativeHandle.
     * This for forwared child method to parrent
     */
    useImperativeHandle(ref, () => ({
      currentSelected, setRowSelected, setRowSelectedClear
    }))


    return (
      <TableContext.Provider value={{currentSelected, setRowSelected, setRowSelectedClear}}>
        <KTCard className='border-none'>
          <KTCardBody className='relative p-0 py-0'>
            <TableStyled ref={table} id='table-parrent' className='sticky overflow-x-scroll'>
              <table
                id='custom_table_component'
                className='table align-middle table-row-dashed fs-6 relative dataTable no-footer overflow-x-scroll'
                {...getTableProps()}
              >
                <thead>
                  <CustomHeader headers={headers} row={rows} showActionButton={showActionButton} />
                </thead>
                <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
                  <ConditinalRendering
                    conditional={rows.length > 0}
                    onTrueComponent={
                      <Fragment>
                        {rows.map((row: Row<any>, i: number) => {
                          prepareRow(row)
                          return (
                            <CustomRow
                              onMenuContext={onMenuContextHandler}
                              row={row}
                              key={`row-${i}-${crypto.randomUUID()}`}
                            />
                          )
                        })}
                      </Fragment>
                    }
                    onFalseComponent={<DataEmepty />}
                  />
                </tbody>
              </table>
            </TableStyled>
            {menuContext && (
              <Fragment>
                <ConditinalRendering
                  conditional={clicked}
                  onTrueComponent={
                    <MenuContext top={points.y} left={points.x}>
                      {currentSelected!.length <= 1
                        ? menuContext.single!(valueContextMenu, query)
                        : menuContext?.multiple!(currentSelected!, query)}
                    </MenuContext>
                  }
                />
              </Fragment>
            )}
            { rows.length !== 0 && <ListPagination />}
            {isLoading && <LoadingTable />}
          </KTCardBody>
        </KTCard>
      </TableContext.Provider>
    )
  }
)

export {useTableComponent, type TableProviderRef}
export default Table
