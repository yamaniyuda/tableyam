/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '../../core/query-response-provider'
import {useQueryRequestProvider} from '../../core/query-request-provider'
import {usePagination, usePaginationProps} from '../../hook/use-pagination'
import PaginationStyle from './_pagination.styled'
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { ItemPerPage } from '../../model'

/**
 * This is component for handling pagination from table
 *
 * @returns {React.ReactElement}
 */
const ListPagination = () => {
  const { state, updateState } = useQueryRequestProvider()
  const pagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()

  const paginationRange = (usePagination({
    currentPage: pagination.page,
    pageSize: pagination.items_per_page,
    totalCount: pagination.total_items,
  } as usePaginationProps) as any[]) ?? [1]


  let lastPage = paginationRange[paginationRange?.length - 1]


  /*
    Update state pagination from parent context
  */
  const updatePage = (page: number | null) => {
    if (!page || isLoading || pagination.page === page) return
    updateState({page, items_per_page: pagination.items_per_page || 10})
  }




  /*
    For wraping handling onClik by element
  */
  const onPageChange = (page: number) => {
    updatePage(page)
  }



  const handleChangePageCount = (e: SelectChangeEvent<any>) => {
    updateState({...state, items_per_page: e.target.value as ItemPerPage})
  }


  return (
    <PaginationStyle>
      <div>
        <FormControl variant="standard" sx={{ m: 1, widows: 120 }}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={state.items_per_page}
            onChange={handleChangePageCount}
            label="Age"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div id='kt_table_user_paginate'>
        <ul>
          {/* Left navigation arrow */}
          <li
            className={clsx('pagination-item ', {
              disabled: pagination.page === 1,
            })}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <div className='arrow left' />
          </li>
          {paginationRange.map((pageNumber) => {
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === '...') {
              return (
                <li key={crypto.randomUUID()} className='pagination-item dots'>
                  &#8230;
                </li>
              )
            }

            // Render our Page Pills
            return (
              <li
                key={crypto.randomUUID()}
                className={clsx('pagination-item', {
                  selected: pageNumber === pagination.page,
                })}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            )
          })}
          {/*  Right Navigation arrow */}
          <li
            className={clsx('pagination-item', {
              disabled: pagination.page === lastPage,
            })}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            <div className='arrow right' />
          </li>
        </ul>
      </div>
    </PaginationStyle>
  )
}

export {ListPagination}
