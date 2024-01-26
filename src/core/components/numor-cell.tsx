import { FC } from "react";
import { CellProps } from "react-table";
import Div from "src/app/widgets/atomic/div";


interface NumberCellProps {
  NumberHeader: any
  NumberRow: any
  Id: string
}


const NumberHeader: FC<CellProps<any>> = ({...props}) => {
  return <Div className="w-[50px]">
    <span>No</span>
  </Div>
}


const NumberRow: FC<CellProps<any>> = ({ ...props }) => {
  return <Div className="text-center">
    <span>{props.data[props.row.index].no}</span>
  </Div>
}


const NumberCell: NumberCellProps = {
  NumberHeader, 
  NumberRow,
  Id: 'table-number'
}


export default NumberCell