# HiveUI Metadata Ingestion

Ingestion frontend for the HIVE experiment at UKAEA

## Docker

To run the UI with Docker, clone the repository and add Keycloak credentials to the `docker-compose.yaml` file:

```yaml
AUTH_SECRET="<openssl rand -hex 32>"
AUTH_KEYCLOAK_ID="<KeycloakClientID>"
AUTH_KEYCLOAK_SECRET="<KeycloakClientSecret>"
AUTH_KEYCLOAK_ISSUER="http://<KeycloakURL>/realms/<realm name>"
```

Then run the following command:

```sh
docker-compose up -d
```

The UI will be available at http://localhost:3000

## Development - Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/)

Developed with Node.js v21.1.0 and npm v10.2.0

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

4. Create a `.env` file in the root directory with the following content:

   ```yaml
   AUTH_SECRET="<openssl rand -hex 32>"
   AUTH_KEYCLOAK_ID="<KeycloakClientID>"
   AUTH_KEYCLOAK_SECRET="<KeycloakClientSecret>"
   AUTH_KEYCLOAK_ISSUER="http://<KeycloakURL>/realms/<realm name>"
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
2. Serve with npm:
   ```sh
   npm run preview
   ```

The UI will be available at http://localhost:4173
