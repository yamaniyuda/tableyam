// @ts-nocheck
import clsx from 'clsx'
import {FC, Fragment, memo, useEffect, useState} from 'react'
import {Row} from 'react-table'
import {useTableProvider} from '../../core/table-provider'
import '../../css/row.css'
import {ConditinalRendering} from 'src/app/widgets/molecule/conditional-rendering'
import {Form} from 'react-bootstrap'
import {useQueryResponseProvider} from 'src/app/widgets/organisms/table/core/query-response-provider'
import { useTableComponent } from '../table'
import CustomColumnStyle from './_custom_row_style'


/**
 * Props for component CustomRow.
 */
interface CustomRowProps {
  row: Row
  onMenuContext: (e: {x: number; y: number}, value: any) => void
}



/**
 * Custom Row for to handle column in ETableGeneral
 * when id have conditional like this [name_id]|no_clicked
 * this column not trigger when row in clicked in table row clicked type
 *
 * @param {CustomRowProps} props - parameter
 * @returns {React.ReactNode}
 */
const CustomRow: FC<CustomRowProps> = memo(({row, onMenuContext}) => {
  const {onClickRow, credentialsName, onSelectedRow, selectedRow, heightRow} = useTableProvider()
  const { currentSelected, setRowSelected } = useTableComponent()
  const {query} = useQueryResponseProvider()
  const [isHover, setIsHover] = useState<boolean>(false)

  useEffect(() => {
    const actionCells: NodeListOf<Element> = document.querySelectorAll('.row--action')
    const tableComponent: Element = document.querySelector('#table-parrent')

    const resizeObserver = new ResizeObserver(() => {
      if (tableComponent.scrollWidth > tableComponent.clientWidth) {
        actionCells.forEach((element) => element.classList.add('column-sticky'))
      } else {
        actionCells.forEach((element) => element.classList.remove('column-sticky'))
      }
    })

    resizeObserver.observe(tableComponent)
    return () => resizeObserver.disconnect()
  }, [])




  /**
   * Row Click Handler.
   * @param {Cell} cell
   * @returns {void}
   */
  const rowClickHandler = (cell: Cell) => {
    if (
      (cell.column.id === 'actions') |
      (cell.column.id === 'table-number') |
      (onClickRow === undefined) |
      (cell.column.id === undefined)
    )
      return
    onClickRow({origin: row.original, currentIndex: row.index})
  }



  /**
   * On Context Menu Handler
   * @param {React.MouseEvent<HTMLTableRowElement>} e
   */
  const onContextMenuHandler = (e: React.MouseEvent<HTMLTableRowElement>, value: any) => {
    e.preventDefault()
    const parrentBounding = e.currentTarget.parentElement?.getBoundingClientRect()

    const x = e.clientX
    const y = -e.currentTarget.parentElement?.clientHeight + (e.clientY - parrentBounding?.top)
    onMenuContext({x, y}, value)
  }



  /**
   * On Change Handler.
   * This method usage for handling updating state selected
   * when component in click and do update state `rowSelected` from
   * context for add new selected in global table.
   *
   * @param {any} value
   */
  const onChangeHandler = (value: any) => {
    const selected = currentSelected.indexOf(value[credentialsName]) !== -1 ? true : false
    try {
      setRowSelected(
        value[credentialsName],
        selected ? 'add' : 'remove'
      )
      onSelectedRow && onSelectedRow({ countChoose: currentSelected, query })
    } catch (e) {
      console.error("CredentialsName not set when use selected row options")
    }
  }



  /**
   * isActiveRow
   * This method usage for get is component active or not, like component
   * after checked keep persistence styling.
   *
   * @param {string} credential
   * @returns {boolean}
   */
  const isActiveRow = (credential: string): boolean => {
    return isHover || currentSelected?.includes(credential)
  }



  const rowKey = row.id || row.index;



  return (
    <Fragment>
      <tr
        key={rowKey}
        {...row.getRowProps()}
        style={{height: heightRow}}
        onMouseEnter={(_) => setIsHover(true)}
        onMouseLeave={(_) => setIsHover(false)}
        onContextMenu={(e) => onContextMenuHandler(e, row.original)}
        className={clsx('transition-all', {
          'bg-gray-200 hover-table-persistence': isActiveRow(row.original[credentialsName]),
        })}
      >
        {row.cells.map((cell, index) => {
          const props = cell.getCellProps()
          return (
            <td
              {...props}
              key={index}
              onClick={() => rowClickHandler(cell)}
              className={clsx('relative', {
                'row--action bg-white': cell.column.id === 'actions',
              })}
            >
              <CustomColumnStyle width={props.style.width}>
                <ConditinalRendering
                  conditional={
                    cell.column.id === 'table-number' &&
                    isActiveRow(row.original[credentialsName]) &&
                    selectedRow
                  }
                  onTrueComponent={
                    <Form.Check
                      type='checkbox'
                      className='ml-2 mx-auto border-none after:contents-[""] rounded border-2 w-[18px] h-[18px] bg-white'
                      checked={ currentSelected?.includes(row.original[credentialsName])}
                      onChange={() => onChangeHandler(cell.row.original)}
                    ></Form.Check>
                  }
                  onFalseComponent={cell.render('Cell')}
                />
              </CustomColumnStyle>
            </td>
          )
        })}
      </tr>
    </Fragment>
  )
})

export {CustomRow}
