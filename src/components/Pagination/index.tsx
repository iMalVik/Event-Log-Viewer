import React from 'react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  totalElementsCount: number;
  perPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageNumber, setPageNumber, totalElementsCount, perPage }) => {
  const { t } = useTranslation()

  const maxPageNumber = Math.ceil(totalElementsCount / perPage)

  return (
    <>
      <div className="pagination">
        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
          {t('prev')}
        </button>
        <span>{t('page')} {pageNumber} {t('of')} {maxPageNumber}</span>
        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === maxPageNumber}>
          {t('next')}
        </button>
      </div>
    </>
  )
}

export default Pagination
