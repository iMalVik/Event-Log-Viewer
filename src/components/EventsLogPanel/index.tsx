import React from 'react'
import { useTranslation } from 'react-i18next'

import { ParsedEvent } from '../../utils/parseEventsData'

interface EventsLogPanelProps {
  events: ParsedEvent[];
}

const EventsLogPanel: React.FC<EventsLogPanelProps> = ({ events }) => {
  const { t } = useTranslation()

  const formatTimestamp = (ts: string | number): string => {
    const numTs = Number(ts)
    if (isNaN(numTs) || numTs <= 0) {
      return t('invalid_date') || 'Invalid Date'
    }
    try {
      return new Date(numTs).toLocaleString(
        undefined,
        {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }
      )
    } catch (e) {
      console.error('Error formatting timestamp:', ts, e)
      return t('invalid_date') || 'Invalid Date'
    }
  }

  if (!events || events.length === 0) {
    return <p className="no-events-message">{t('no_events_to_display') || 'No events to display.'}</p>
  }

  return (
    <div className="event-list-container">
      <table className="events-table">
        <thead>
        <tr>
          <th>{t('time')}</th>
          <th>{t('code')}</th>
          <th>{t('event')}</th>
        </tr>
        </thead>
        <tbody>
        {events.map((event, index) => (
          <tr
            key={`${event.timestamp}-${event.code}-${index}`}
            className="event-row"
          >
            <td data-label={t('timestamp')}>{formatTimestamp(event.timestamp)}</td>
            <td data-label={t('code')}>{event.code}</td>
            <td data-label={t('event')}>{event.description}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventsLogPanel
