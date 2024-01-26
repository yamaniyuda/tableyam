import TableProvider, {TableProviderProps} from './core/table-provider'
import Column, {ColumnProps} from './components/column'
import {ColumnHelper} from './helpers/column-helper'
import {FC} from 'react'

export interface TableComponent extends TableProviderProps {
  Column: FC<ColumnProps<any>>
}

const Table: TableComponent = TableProvider
Table.Column = Column

export { ColumnHelper }
export default Table