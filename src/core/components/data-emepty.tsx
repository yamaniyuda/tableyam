import {FC} from 'react'

/**
 * Date Empety.
 * @returns {ReactElement}
 */
const DataEmepty: FC = () => {
  return (
    <tr>
      <td colSpan={7}>
        <div className='d-flex text-center w-100 algin-content-center justify-content-center'>
          Data Tidak Ditemukan
        </div>
      </td>
    </tr>
  )
}

export {DataEmepty}
