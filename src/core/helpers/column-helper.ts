import clsx from "clsx"
import { ReactElement, createElement } from "react"
import { CellProps } from "react-table"
import { StringHelpers } from "src/app/helpers/string-helpers"
import Div, { DivProps } from "src/app/widgets/atomic/div"

export type CreateTextColumnParams = {
  keys: string[],
  className?: string
  customChildren?: ReactElement,
}


export class ColumnHelper {

  /**
   * createSanElement
   * This method usage for handling create span element
   * @param {any} value 
   * @param {any} params 
   * @returns {DetailedReactHTMLElement}
   */
  public static createSpanElement = (value: any, params?: any) => {
    return createElement('span', {
      className: 'text-base',
      children: value,
      ...params
    })
  }



  /**
   * createTextColumn
   * @param {CreateTextColumnParams} params 
   * @returns {CreateTextColumnParams}
   */
  public static createTextColumn = (params: CreateTextColumnParams) => {
    return (cell: CellProps<any>) => {

      return createElement<DivProps>(
        Div, {
          className: clsx('text-center', {
            [params.className]: params.className,
          }),
          children: params?.customChildren ?? this.createSpanElement(StringHelpers.getValueDeepObject(cell.data[cell.row.index], ...params.keys))
        }
      )
    }
  }
}