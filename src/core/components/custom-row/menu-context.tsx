import {motion} from 'framer-motion'
import {FC, ReactElement} from 'react'

interface MenuContextProps {
  top: number
  left: number
  children: ReactElement
}


/**
 * Menu Context
 * 
 * @param {MenuContextProps} param0 
 * @returns {FC<MenuContextProps>}
 */
export const MenuContext: FC<MenuContextProps> = ({top, left, children}) => {
  return (
    <motion.div
      initial={{opacity: 0.5, scale: 0.9, translateX: -30}}
      animate={{opacity: 1, scale: 1, translateX: 1}}
      transition={{duration: 0.1}}
      className={`absolute z-40 bg-white border-[1px] shadow w-[150px] p-2 rounded-md top-[${top}px]`}
      style={{
        y: `${top}px`,
        x: `${left - 300}px`,
      }}
    >
      {children}
    </motion.div>
  )
}
