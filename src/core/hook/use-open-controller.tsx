import { useCallback, useState } from "react";


interface UseOpenControllerReturn {
  isOpen: boolean
  toggle: () => void
}


/**
 * useOpenController.
 * This hook usage for handling is row expandable or not.
 * 
 * @param {boolean} initialState 
 * @returns {UseOpenControllerReturn}
 */
const useOpenController = (initialState: boolean): UseOpenControllerReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)

  const toggle = useCallback(() => {
    setIsOpen((state) => !state)
  }, [setIsOpen])

  return { isOpen, toggle }
}

export default useOpenController