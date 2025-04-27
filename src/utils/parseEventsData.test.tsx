import parseEventData, { ParsedEvent, RawXMLData } from './parseEventsData' // Adjust the import path as needed

// --- Test Suite ---
describe('parseEventData', () => {

  // --- Mock Data ---
  const mockValidRawData: RawXMLData = {
    DATAPACKET: {
      Response: {
        Events: {
          Event: [
            { TimeStamp: '1678886400000', Code: '101', Description: 'System Start' },
            { TimeStamp: '1678886460000', Code: '205', Description: 'User Login' },
            { TimeStamp: '1678886520000', Code: '404', Description: 'Resource Not Found' }
          ],
          TotalLogCount: '150' // String as potentially received from XML
        }
      }
    }
  }

  const mockParsedEvents: ParsedEvent[] = [
    { timestamp: '1678886400000', code: 101, description: 'System Start' },
    { timestamp: '1678886460000', code: 205, description: 'User Login' },
    { timestamp: '1678886520000', code: 404, description: 'Resource Not Found' }
  ]

  const mockExpectedTotalCount = 150

  // --- Test Cases ---

  it('should correctly parse valid raw data with multiple events', () => {
    const { events, totalLogCount } = parseEventData(mockValidRawData)

    expect(events).toHaveLength(3)
    expect(events).toEqual(mockParsedEvents) // Deep equality check
    expect(totalLogCount).toBe(mockExpectedTotalCount)
  })

  it('should return an empty events array and correct total count if Event array is empty', () => {
    const rawDataEmptyEvents: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            Event: [], // Empty array
            TotalLogCount: '5'
          }
        }
      }
    }
    const { events, totalLogCount } = parseEventData(rawDataEmptyEvents)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBe(5)
  })

  it('should return an empty events array and correct total count if Event property is missing', () => {
    const rawDataMissingEventProp: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            // Event property is missing
            TotalLogCount: '10'
          }
        }
      }
    }
    // Mock console.warn to prevent noise during test runs (optional)
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { })
    const { events, totalLogCount } = parseEventData(rawDataMissingEventProp)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBe(10)
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find \'Event\' array')) // Check if warning was logged

    consoleWarnSpy.mockRestore() // Clean up spy
  })

  it('should return an empty events array and NaN total count if Events property is missing', () => {
    const rawDataMissingEvents: RawXMLData = {
      DATAPACKET: {
        Response: {
          // Events property is missing
        }
      }
    }
    const { events, totalLogCount } = parseEventData(rawDataMissingEvents)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBeNaN() // Number(undefined) results in NaN
  })

  it('should return an empty events array and NaN total count if Response property is missing', () => {
    const rawDataMissingResponse: RawXMLData = {
      DATAPACKET: {
        // Response property is missing
      }
    }
    const { events, totalLogCount } = parseEventData(rawDataMissingResponse)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBeNaN()
  })

  it('should return an empty events array and NaN total count if DATAPACKET property is missing', () => {
    const rawDataMissingDataPacket: RawXMLData = {} // Empty object
    const { events, totalLogCount } = parseEventData(rawDataMissingDataPacket)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBeNaN()
  })

  it('should return an empty events array and NaN total count for null input', () => {
    const { events, totalLogCount } = parseEventData(null)
    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBeNaN()
  })

  it('should return an empty events array and NaN total count for undefined input', () => {
    const { events, totalLogCount } = parseEventData(undefined)
    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBeNaN()
  })

  it('should handle events with missing properties gracefully', () => {
    const rawDataPartialEvents: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            Event: [
              { TimeStamp: '1678886400000', Code: '101', Description: 'Valid Event' },
              // @ts-expect-error Testing missing property
              { TimeStamp: '1678886460000', Description: 'Missing Code' }, // Missing Code
              // @ts-expect-error Testing missing property
              { TimeStamp: '1678886520000', Code: '303' /* Missing Description */ },
              // @ts-expect-error Testing missing property
              { Code: '404', Description: 'Missing Timestamp' }
            ],
            TotalLogCount: '4'
          }
        }
      }
    }
    const expectedParsed: ParsedEvent[] = [
      { timestamp: '1678886400000', code: 101, description: 'Valid Event' },
      { timestamp: '1678886460000', code: 0, description: 'Missing Code' }, // Code defaults to 0 (NaN parsed)
      { timestamp: '1678886520000', code: 303, description: '' }, // Description defaults to ''
      // @ts-expect-error Testing missing property
      { timestamp: undefined, code: 404, description: 'Missing Timestamp' } // Timestamp is undefined
    ]
    const { events, totalLogCount } = parseEventData(rawDataPartialEvents)

    expect(events).toHaveLength(4)
    expect(events).toEqual(expectedParsed)
    expect(totalLogCount).toBe(4)
  })

  it('should handle non-numeric Code strings by setting code to 0', () => {
    const rawDataInvalidCode: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            Event: [
              { TimeStamp: '1678886400000', Code: 'OK', Description: 'Non-numeric code' },
              { TimeStamp: '1678886460000', Code: '500', Description: 'Valid code' },
              { TimeStamp: '1678886520000', Code: '', Description: 'Empty code string' }
            ],
            TotalLogCount: '3'
          }
        }
      }
    }
    const expectedParsed: ParsedEvent[] = [
      { timestamp: '1678886400000', code: 0, description: 'Non-numeric code' },
      { timestamp: '1678886460000', code: 500, description: 'Valid code' },
      { timestamp: '1678886520000', code: 0, description: 'Empty code string' }
    ]
    const { events, totalLogCount } = parseEventData(rawDataInvalidCode)

    expect(events).toHaveLength(3)
    expect(events).toEqual(expectedParsed)
    expect(totalLogCount).toBe(3)
  })

  it('should handle non-numeric TotalLogCount string by setting totalLogCount to NaN', () => {
    const rawDataInvalidCount: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            Event: [{ TimeStamp: '1', Code: '1', Description: 'Desc' }],
            TotalLogCount: 'Not A Number' // Invalid count
          }
        }
      }
    }
    const { events, totalLogCount } = parseEventData(rawDataInvalidCount)

    expect(events).toHaveLength(1) // Event parsing should still work
    expect(totalLogCount).toBeNaN()
  })

  it('should filter out non-object entries in the Event array', () => {
    const rawDataMixedTypes: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            Event: [
              { TimeStamp: '1', Code: '1', Description: 'Valid 1' },
              // @ts-expect-error Testing invalid type
              null, // Invalid entry
              { TimeStamp: '2', Code: '2', Description: 'Valid 2' },
              // @ts-expect-error Testing invalid type
              undefined, // Invalid entry
              // @ts-expect-error Testing invalid type
              'a string', // Invalid entry
              // @ts-expect-error Testing invalid type
              123 // Invalid entry
            ],
            TotalLogCount: '10'
          }
        }
      }
    }
    const expectedParsed: ParsedEvent[] = [
      { timestamp: '1', code: 1, description: 'Valid 1' },
      { timestamp: '2', code: 2, description: 'Valid 2' }
    ]
    const { events, totalLogCount } = parseEventData(rawDataMixedTypes)
    expect(events).toHaveLength(2)
    expect(events).toEqual(expectedParsed)
    expect(totalLogCount).toBe(10)
  })

  it('should handle case where Event property is not an array', () => {
    const rawDataEventNotArray: RawXMLData = {
      DATAPACKET: {
        Response: {
          Events: {
            // @ts-expect-error Testing invalid type for Event
            Event: { TimeStamp: '1', Code: '1', Description: 'Single object, not array' },
            TotalLogCount: '5'
          }
        }
      }
    }
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { })
    const { events, totalLogCount } = parseEventData(rawDataEventNotArray)

    expect(events).toHaveLength(0)
    expect(events).toEqual([])
    expect(totalLogCount).toBe(5) // Total count should still be parsed if available
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('it\'s not an array'))

    consoleWarnSpy.mockRestore()
  })

})
