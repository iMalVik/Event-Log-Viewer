# React Event Log Viewer

[![Vercel Deployment](https://img.shields.io/badge/deployed%20on-vercel-brightgreen)](https://event-log-viewer.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/iMalVik/Event-Log-Viewer)


This project is a React application designed to load and display event log data from an XML file. It utilizes TypeScript for static typing, CSS
modules for styling, and React hooks for managing component logic.

## Project Features Overview

| Feature               | Status |
|:----------------------|:------:|
| XML Parsing           | ✅     |
| Structured Data Panel | ✅     |
| Localization (EN/RU)  | ✅     |
| Pagination            | ✅     |
| Unit Tests (Jest)      | ✅     |
| Deployment on Vercel  | ✅     |

---

## Features

### Loading and Parsing XML Data

The application is capable of loading event log data stored in an XML file (`public/EventLog_GetEventsLog.xml`). It parses the XML content and
extracts relevant event information.

### Displaying Data in a Structured Panel

The parsed event data is presented in a structured and user-friendly panel, making it easy to navigate and understand the event details.
The `EventsLogPanel` component is responsible for render data.

### Localization Support

The application supports localization, allowing the user interface to be displayed in different languages.

- Currently available languages: **English** and **Russian**.
- Translations are located in `src/localization/locales`.
- You can switch the language by adding a query parameter to the URL:

    - English: [http://localhost:3000/?locale=en](http://localhost:3000/?locale=en)
    - Russian: [http://localhost:3000/?locale=ru](http://localhost:3000/?locale=ru)

This approach makes it easy to test and expand localization support in the future.

### Pagination

The application implements pagination, enabling the display of large sets of event data in manageable chunks. The `Pagination` component is
responsible for managing the pagination.

## Project Structure

The project is organized into the following key directories:

* **`public/`**: Contains static assets, including the `EventLog_GetEventsLog.xml` file with the sample event log data, as well as `index.html` and
  other public resources.
* **`src/`**: Contains all the source code for the React application.
    * **`components/`**: Contains React components.
        * `EventsLogPanel/`: The component which render event log data.
        * `Pagination/`: The component for pagination.
    * **`hooks/`**: Contains custom React hooks.
        * `useLoadXmlData.ts`: loads data from XML file.
    * **`localization/`**: Contains JSON files for language translations and the `i18n.ts` file to configure language settings.
    * **`utils/`**: Contains utility functions.
        * `parseEventsData.ts`: provides functionality to parse events from xml data.
    * **`App.tsx`**: The main application component.
    * **`index.tsx`**: The entry point of the React application.
* **`package.json`**: The file stores information about the project and its dependencies.

## Testing

The project includes unit tests to ensure the reliability of key functionalities, particularly the XML event data parsing logic.

- The tests for the `parseEventData` utility are written using **Jest**.
- They cover various scenarios, including:
    - Correct parsing of valid XML data.
    - Handling of missing or malformed fields.
    - Edge cases such as empty inputs, missing properties, or invalid data types.
    - Graceful handling of unexpected data structures.
- You can find the test suite in the corresponding `parseEventsData.test.ts` file (located near `parseEventsData.ts`).

To run the tests, execute:

```bash
yarn test
```

## Deployment

The project is deployed on [Vercel](https://vercel.com/).

You can view the live version of the application here:  
👉 [https://event-log-viewer.vercel.app](https://event-log-viewer.vercel.app)

- You can switch the language by adding a query parameter to the URL:
    - English: [https://event-log-viewer.vercel.app/?locale=en](https://event-log-viewer.vercel.app/?locale=en)
    - Russian: [https://event-log-viewer.vercel.app/?locale=ru](https://event-log-viewer.vercel.app/?locale=ru)

## Repository

You can find the project source code here:  
👉 [https://github.com/iMalVik/Event-Log-Viewer](https://github.com/iMalVik/Event-Log-Viewer)


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn test`

Launches the test runner in interactive mode.

### `yarn build`

Builds the app for production.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

This command will remove the single build dependency from your project.

