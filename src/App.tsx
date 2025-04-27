import { useState } from 'react'

import EventList from './components/EventsLogPanel'
import Pagination from './components/Pagination'
import { useLoadXmlData } from './hooks/useLoadXmlData'

import './localization/i18n'
import './App.css'

export const PER_PAGE_ELEMENTS = 3

function App() {
  const [pageNumber, setPageNumber] = useState(1)
  const { events, totalLogCount, isLoading } = useLoadXmlData({ isPaginationEnabled: true, pageNumber, perPage: PER_PAGE_ELEMENTS })

  return (
    <div>
      {isLoading ?
        <div>Loading...</div> :
        <div className="App">
          <EventList events={events}/>
          <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalElementsCount={totalLogCount} perPage={PER_PAGE_ELEMENTS}/>
        </div>
      }
    </div>
  )
}

export default App
