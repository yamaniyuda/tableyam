// @ts-nocheck
import clsx from 'clsx'
import {FC, Fragment, useMemo} from 'react'
import {ColumnInstance} from 'react-table'
import { useTableProvider } from 'src/app/widgets/organisms/table/core/table-provider'

/**
 * Props for component Header column.
 */
interface HeaderColumnProps {
  column: ColumnInstance
  [key: string]: any
}

/**
 * This component usage for handling header component show.
 * @param param0 - This props params with type `HeaderColumnProps`
 * @returns {ReactElement}
 */
const HeaderColumn: FC<HeaderColumnProps> = ({column, row}) => {
  const {actionWidth} = useTableProvider()
  const afterWidth = useMemo(() => {
    return actionWidth !== undefined ? `after:w-[${actionWidth}px]` : 'after:w-[100px]'
  }, [actionWidth])
  const {style, ...props} = column.getHeaderProps()
 
  return (
    <Fragment>
      <th
        {...props}
        style={{
          ...style,
          width: row.length > 0 ? style.width : null
        }}
        className={clsx('text-center', {
          [`sticky p-0 bg-white right-0 pl-1 pb-3 after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:translate-x-[-100%] after:shadow-table-column-fix-shadow ${afterWidth}`]:
            column.id === 'actions',
        })}
      >
        {column.render('Header')}
      </th>
    </Fragment>
  )
}

export {HeaderColumn}
