import format from 'date-fns/format'
import { createSelector } from 'reselect'
import Transaction from '../../../entities/Transaction'

export const getDateLabel = state => {
  const { dateStart, dateEnd } = state.ui.transaction.filter
  return format(dateStart, 'DD MMM') !== format(dateEnd, 'DD MMM')
    ? `${format(dateStart, 'DD MMM')} — ${format(dateEnd, 'DD MMM')}`
    : format(dateStart, 'DD MMMM')
}

export const getFilters = state => ({
  date: {
    start: state.ui.transaction.filter.dateStart,
    end: state.ui.transaction.filter.dateEnd
  },
  accounts: new Set(state.ui.transaction.filter.applied.accounts)
})

export const getPage = state => state.ui.transaction.filter.page

export const getLastPage = state => {
  return Math.ceil(
    state.ui.transaction.filter.totalRows / state.ui.transaction.filter.perPage
  )
}

export const getPagerSize = state =>
  state.ui.isMobile ? Transaction.pagerSizeMobile : Transaction.pagerSizeDesktop

export const getVisiblePages = createSelector(
  getPage,
  getLastPage,
  getPagerSize,
  (current, last, size) => {
    const pages = []
    const offset = Math.max(0, last - current - Math.ceil(size / 2))
    const windowRight = last > size ? Math.max(size, last - offset) : last
    const windowLeft = Math.max(0, windowRight - size)

    for (let page = windowLeft; page < windowRight; page++) {
      pages.push(page)
    }

    return pages
  }
)