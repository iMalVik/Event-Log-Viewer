import { useCallback, useEffect, useState } from 'react'
import { XMLParser } from 'fast-xml-parser'

import parseEventData, { ParsedEvent, RawXMLData } from '../utils/parseEventsData'

interface LoadXmlDataProps {
  isPaginationEnabled: boolean;
  pageNumber: number;
  perPage: number;
}

export const useLoadXmlData = ({ isPaginationEnabled, pageNumber, perPage }: LoadXmlDataProps) => {
  const [events, setEvents] = useState<ParsedEvent[]>([])
  const [totalLogCount, setTotalLogCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadXmlData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetch('/EventLog_GetEventsLog.xml').then((response) => {
        return response.blob()
      }).then((blob) => { return blob.text() })

      const parser = new XMLParser({
        ignoreAttributes: false,
        transformAttributeName(attributeName) {
          return attributeName.replace('@_', '')
        }
      })

      const eventsData = parser.parse(data) as RawXMLData

      const { events, totalLogCount: total } = parseEventData(eventsData)
      setTotalLogCount(total)

      if (isPaginationEnabled) {
        const startIndex = (pageNumber - 1) * perPage
        const endIndex = startIndex + perPage

        setEvents(events.slice(startIndex, endIndex))
      } else {
        setEvents(events)
      }

    } catch (error) {
      alert(error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [isPaginationEnabled, pageNumber, perPage])

  useEffect(() => {
    loadXmlData()
  }, [loadXmlData])

  return {
    events,
    totalLogCount,
    isLoading
  }
}
