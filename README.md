# Website

Website is a full-stack web application built with Nest.js for the backend, Next.js for the frontend, and tRPC for end-to-end typesafe APIs. It is containerized using Docker and includes a CI/CD pipeline for automated testing and deployment.

## Installation

To set up the project locally, follow these steps:

```bash
git clone https://github.com/caffellatte/website.git
cd website
pnpm install
```

## Use

```bash
pnpm dev
```

## Environment

### Postgres

Create network

```bash
docker network create pgadmin
```

Edit `utils/.env`

```bash
POSTGRES_DB=db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
PGADMIN_DEFAULT_EMAIL=default@email.com
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_LISTEN_PORT=80
```

### Docker

Goto `utils` folder

```bash
cd utils
```

Start

```bash
docker-compose up
```

Remove

```bash
docker-compose down -v
```
