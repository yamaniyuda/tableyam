import { useCallback, useState } from "react"

type SetRowSelected = (value: string, type: 'add' | 'remove') => void
type SetRowSelectedClear = () => void


interface UseRowSelectControllerReturn {
  currentSelected: string[]
  setRowSelected: SetRowSelected
  setRowSelectedClear: SetRowSelectedClear
}


/**
 * useRowSelectController.
 * This hook for handling row clicked.
 * 
 * @returns {UseRowSelectControllerReturn}
 */
const useRowSelectController = (): UseRowSelectControllerReturn => {
  const [rowSelected, setRowSelected] = useState<string[]>([])

  const rowSelectedHandler = useCallback((value: string, type: "add" | "remove") => {
    if (type === 'add') setRowSelected((prev) => prev.filter(e => e !== value))
    else setRowSelected(prev => [...prev, value])
  }, [setRowSelected])

  const rowSelectedClearHandler = useCallback(() => {
    setRowSelected(() => [])
  }, [setRowSelected])


  return {
    currentSelected: rowSelected,
    setRowSelected: rowSelectedHandler,
    setRowSelectedClear: rowSelectedClearHandler
  }
}

export { type SetRowSelected, type SetRowSelectedClear, type UseRowSelectControllerReturn }
export default useRowSelectController