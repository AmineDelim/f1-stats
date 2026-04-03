# 🏎️ F1 Stats Platform

Formula 1 statistics platform built on a microservices architecture.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Ingress (f1.local)             │
└──────┬──────────┬──────────┬────────┬───────┘
       │          │          │        │
       ▼          ▼          ▼        ▼
  /drivers    /races     /teams   /favorites
       │          │          │        │
       ▼          ▼          │        ▼
  driver-      race-      team-   favorites-
  stats-       stats-     stats-  service
  service      service    service    │
       │                    │        ▼
       └────────────────────┘   PostgreSQL
         inter-service
         communication
```

## Microservices

| Service | Port | Description |
|---|---|---|
| driver-stats-service | 3001 | Driver statistics (OpenF1) |
| race-stats-service | 3002 | Race statistics (OpenF1) |
| team-stats-service | 3003 | Team statistics (calls driver-stats) |
| favorites-service | 3004 | Favorite drivers (PostgreSQL) |
| frontend | 80 | React Dashboard |

## Tech Stack

- **Node.js** — REST microservices
- **React + Vite** — frontend
- **PostgreSQL** — favorites database
- **Docker** — containerization
- **Kubernetes / Minikube** — orchestration
- **Ingress Nginx** — API gateway
- **RBAC** — Kubernetes security
- **OpenF1 API** — real-time F1 data

## Getting Started

### Prerequisites
- Docker
- Minikube
- kubectl

### Setup

```bash
# Start Minikube
minikube start --driver=docker --docker-opt="dns=8.8.8.8"

# Enable Ingress
minikube addons enable ingress

# Add f1.local to /etc/hosts
echo "$(minikube ip) f1.local" | sudo tee -a /etc/hosts

# Deploy
kubectl apply -f k8s/rbac.yml
kubectl apply -f k8s/f1-app.yml

# Check pods
kubectl get pods
```

### Access
Open http://f1.local in your browser.

## REST Endpoints

### driver-stats-service
```
GET /drivers          → list all 2025 drivers
GET /drivers/:number  → get a specific driver
```

### race-stats-service
```
GET /races            → list all 2024 races
GET /races/:key       → get a specific race
```

### team-stats-service
```
GET /teams            → list all teams (via driver-stats-service)
GET /teams/:name      → get a specific team
```

### favorites-service
```
GET    /favorites          → list favorite drivers
POST   /favorites          → add a driver to favorites
DELETE /favorites/:number  → remove a driver from favorites
```

## Project Structure

```
f1-stats/
├── driver-stats-service/
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
├── race-stats-service/
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
├── team-stats-service/
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
├── favorites-service/
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── f1-app.yml
│   └── rbac.yml
└── README.md
```

## Author
Amine DELIM