# Rush Hour - NestJS Monorepo

Rush Hour is an innovative puzzle-solving platform where players move cars on a six-by-six board to free a special red car. This NestJS monorepo provides the infrastructure to power the platform, consisting of three microservices:

- **API**: A RESTful API for client interactions.
- **Consumer**: A background worker for asynchronous message processing.
- **Cron**: A cronjob service for cleaning up game states and caches.

## Features
- Create, start, and play Rush Hour puzzles.
- Real-time evaluation of moves as "Good," "Waste," or "Blunder."
- Automatic cleanup of inactive games.
- Swagger documentation for API exploration.

---

## Monorepo Structure

```
apps/
  - api          # REST API microservice
  - consumer     # Background worker microservice
  - cron         # Cronjob microservice

libs/
  - cache        # Shared caching utilities
  - repo         # Shared database repositories

packages/
  - types        # Shared TypeScript types
```

---

## Prerequisites

Ensure you have the following installed:
- [Docker Compose](https://docs.docker.com/compose/)
- [Tilt](https://tilt.dev/) (optional, for monitoring)
- [pnpm](https://pnpm.io/)

---

## Getting Started

### Development Setup
1. **Start Docker Services**:
   To run Redis, Kafka, and MongoDB for development:
   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Run Microservices**:
   ```bash
   pnpm run dev
   ```
   This will start all three microservices.

4. **Monitor Services** (Optional):
   If Tilt is installed, you can run:
   ```bash
   tilt up
   ```
   This provides a dashboard to monitor all services, including Docker.

---

### Handling Consumer Startup
On the first run, the Consumer microservice may fail due to missing Kafka topics. Restart the Consumer after the initial startup:


---

## Usage

### API Endpoints
The API is available at `http://localhost:8888`. Swagger documentation is accessible at:
- [API Docs](http://localhost:8888/docs)

#### Available Endpoints:
- **POST /create-board**: Create a new 6x6 game board.
- **POST /start-game/{boardId}**: Start a game using a created board.
- **GET /game/{gameId}**: Fetch the current game state.
- **PUT /move-car/{gameId}**: Move a car and evaluate the move.

---

## Monitoring

### Redis
Accessible at `localhost:5540`. Use the following connection string:
```
redis://redis:6379
```

### Kafka
Kafka messages can be viewed via Kafka-UI at:
- [Kafka UI](http://localhost:8080)

---

## Notes
- The API is hosted on port `8888`.
- Use `docker-compose-dev.yml` for local development with Redis, Kafka, and MongoDB.
- The cron service runs every 10 seconds to clean up inactive games (including solved games).
