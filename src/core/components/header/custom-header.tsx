import clsx from 'clsx'
import {FC, Fragment, memo} from 'react'
import {ColumnInstance} from 'react-table'
import {HeaderColumn} from './header-column'

/**
 * Props for custom header
 */
export interface CustomHeaderProps {
  headers: ColumnInstance<any>[]
  showActionButton?: boolean
  [key: string]: any
}

/**
 * Custom Header.
 * This component usage for wraping column header or
 * acts as a wrapping element.
 *
 * @param param0 - props for custom header
 * @returns {ReactElement}
 */
export const CustomHeader: FC<CustomHeaderProps> = memo(({headers, showActionButton, row}) => {
  return (
    <Fragment>
      <tr
        className={clsx('text-start text-muted fw-bolder fs-7 text-uppercase gs-0', {
          'sticky right-0': showActionButton,
        })}
      >
        {headers.map((column: ColumnInstance<any>) => (
          <HeaderColumn row={row} key={`header-table-${crypto.randomUUID()}`} column={column} />
        ))}
      </tr>
    </Fragment>
  )
})
