# HiveUI Metadata Ingestion

Ingestion frontend for the HIVE experiment at UKAEA

## Docker

To run the UI with Docker, clone the repository and use the following command:

```sh
docker-compose up -d
```

The UI is secured with Keycloak and the Keycloak parameters can be modified in the `docker-compose.yaml` file.

The UI will be available at http://localhost:3000

## Development - Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/)

## Installing HiveUI

1. Clone the repository:

   ```sh
   git clone https://github.com/BDevT/HiveUI.git
   ```

2. Navigate to the project directory:

   ```sh
   cd HiveUI
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

## Running HiveUI (Development)

1. Run a development server with npm:
   ```sh
   npm run dev -- --open
   ```

The UI will be available at http://localhost:5173

## Running HiveUI (Production)

1. Build with npm:
   ```sh
   npm run build
   ```
2. Serve with Node:
   ```sh
   node build
   ```

The UI will be available at http://localhost:3000
