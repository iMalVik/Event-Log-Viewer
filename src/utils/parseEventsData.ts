/**
 * Interface defining the structure of a raw event object from the input JSON.
 */
export interface RawEvent {
  TimeStamp: string;
  Code: string;
  Description: string;
}

/**
 * Interface defining the structure of a parsed event object.
 */
export interface ParsedEvent {
  timestamp: string;
  code: number;
  description: string;
}

/**
 * Interface loosely defining the expected input data structure.
 * Using optional chaining allows for flexibility if parts are missing.
 */
export interface RawXMLData {
  DATAPACKET?: {
    Response?: {
      Events?: {
        Event?: RawEvent[];

        TotalLogCount: string;
      };
    };
  };
}

function parseEventData(rawDataObject: RawXMLData | null | undefined): { events: ParsedEvent[], totalLogCount: number } {
  const rawEventsArray = rawDataObject?.DATAPACKET?.Response?.Events?.Event
  const totalLogCount = Number(rawDataObject?.DATAPACKET?.Response?.Events?.TotalLogCount)

  if (!Array.isArray(rawEventsArray)) {
    console.warn('Could not find \'Event\' array at the expected path or it\'s not an array.')
    return { events: [], totalLogCount }
  }

  const parsedEvents = rawEventsArray
    .filter(event => event && typeof event === 'object')
    .map((rawEvent: RawEvent) => {
      const timestampNum = rawEvent.TimeStamp
      const codeNum = parseInt(rawEvent.Code, 10)

      return {
        timestamp: timestampNum,
        code: !isNaN(codeNum) ? codeNum : 0,
        description: rawEvent.Description || ''
      }
    })

  return { events: parsedEvents, totalLogCount }
}

export default parseEventData
