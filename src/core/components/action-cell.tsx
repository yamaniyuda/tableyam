/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {KTIcon} from 'src/_metronic/helpers'
import {ConditinalRendering} from 'src/app/widgets/molecule/conditional-rendering'
import {useQueryResponseProvider} from '../core/query-response-provider'
import {useTableProvider} from '../core/table-provider'
import Div from 'src/app/widgets/atomic/div'
import Text from 'src/app/widgets/atomic/text'
import { CellProps } from 'react-table'



interface ActionCellProps {
  ActionHeader: any
  ActionsRow: any
  Id: string
}



const ActionHeader: FC = () => {
  return (
    <Div className='flex justify-center items-center min-w-[50px]'>
      <Text>Aksi</Text>
    </Div>
  )
}



const ActionsRow: FC<CellProps<any>> = ({...props}) => {
  const {customActionsCell} = useTableProvider()
  const {query} = useQueryResponseProvider()
  const data = props.data[props.row.index]

  return (
    <div className='bg-white relative'>
      <ConditinalRendering
        conditional={typeof customActionsCell !== 'undefined'}
        onTrueComponent={customActionsCell ? customActionsCell(data, query) : <></>}
        onFalseComponent={
          <a
            href='#'
            className='w-30px'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='dots-vertical' className='text-4xl text-black' />
          </a>
        }
      />
    </div>
  )
}



const ActionCell: ActionCellProps = {
  ActionHeader, 
  ActionsRow,
  Id: 'actions'
}


export default ActionCell
export {type ActionCellProps}
