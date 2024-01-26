import {FC, Fragment, ReactElement} from 'react'
import {CellProps} from 'react-table'

interface ColumnProps<T extends object> {
  id: string
  headerName: string
  children: (cell: CellProps<T>) => ReactElement
  headerClassName?: string
  type?: 'ColumnProps'
  sticky?: 'right' | 'left'
  width?: string
}

const Column: FC<ColumnProps<any>> = ({id, headerName, children, headerClassName}) => {
  return <Fragment></Fragment>
}

export { type  ColumnProps}
export default Column