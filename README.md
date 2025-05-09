# Task Management Application (A Cloud Engineering Perspective)

<div align="center">
  <img src="asset/task-app-demo.png" alt="Task Management App Demo" width="800">
</div>

## Overview

A modern task management application built with **React + TypeScript** (frontend), **NestJS** (backend), and **PostgreSQL** (database). Features include:

- Secure user authentication
- Intuitive task management
- Real-time dashboard statistics
- Responsive Material-UI design

---

## Built With
![System Architecture](asset/system-architecture.png)

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
* ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Backend
* ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
* ![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge)
* ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## Features

1. **User Management**
   - Secure registration and login
   - JWT-based authentication
   - Password validation and security

2. **Task Management**
   - Create, read, update, and delete tasks
   - Set task priorities
   - Mark tasks as complete/incomplete
   - Filter and sort tasks

3. **Dashboard**
   - Task statistics overview
   - Priority distribution
   - Completion status tracking
   - Due date monitoring

## API Testing with Swagger
<img src="asset/task-mgt-api-testing.png" alt="Task Management API Testing" width=600>

## Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm
* PostgreSQL

## 📽️ Demo Video Walkthrough
<a href="https://www.youtube.com/watch?v=peW7_lM2Af8" target="_blank">
  <img src="asset/task-app-demo.png" alt="Video Walkthrough" title="Watch on YouTube" width="600"/>
</a>

#### A comprehensive video walkthrough demonstrating:
- User registration and authentication
- Task creation and management
- Dashboard features and statistics
- Responsive design across devices

### Installation

1. Clone the repository
```sh
git clone https://github.com/AyoyimikaAjibade/Task-Mgt-App.git
```

2. Install frontend dependencies
```sh
cd frontend
npm install
```

3. Install backend dependencies
```sh
cd backend
npm install
```

4. Set up environment variables
```sh
# Backend .env
DATABASE_URL=postgresql://username:password@localhost:5432/taskdb (making stuff up set up your DB)
JWT_SECRET=your-secret-key

# Backend .env
REACT_APP_API_URL=http://localhost:8080

# Frontend .env
REACT_APP_URL=http://localhost:3000
```

5. Start the development servers
```sh
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm start
```

6. To get your specific JWT_SECRET, you can use the following command on your terminal:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage

1. Register a new account with username and password
2. Log in to access the dashboard
3. Create new tasks using the 'Add Task' button
4. View task statistics on the dashboard
5. Manage tasks through the tasks page

## ☁️ Cloud Deployment (GCP + Kubernetes)

This app is fully dockerized and deployed using **Google Kubernetes Engine (GKE)**. Below is a summary of the deployment and orchestration strategy.

### Architecture Overview
- **Frontend**: React.js (served with NGINX)
- **Backend**: NestJS API
- **Database**: PostgreSQL (via Cloud SQL)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (GKE)
- **Ingress & HTTPS**: NGINX Ingress + Cert-Manager + Let’s Encrypt
- **Monitoring**: Google Cloud Logging + Grafana

### ⚙️ Deployment Steps
1. **Create Dockerfiles** for building frontend and backend images
2. **Build and push images** to Google Artifact Registry or Docker Hub (if you choose)
3. **Set up GCP environment**:
   ```bash
   gcloud auth login
   gcloud services enable container.googleapis.com
   gcloud container clusters create CLUSTER_NAME --zone ZONE_NAME --num-nodes=CHOICE_OF_NODES_NUMBER
   gcloud container clusters get-credentials CLUSTER_NAME --zone ZONE_NAME
   ```
4. **Apply Kubernetes YAML files**:
   ```bash
   kubectl apply -f frontend/frontend-deployment.yml
   kubectl apply -f frontend/frontend-service.yml

   kubectl apply -f backend/backend-deployment.yml
   kubectl apply -f backend/backend-service.yml

   kubectl apply -f postgres-deployment.yml
   kubectl apply -f postgres-service.yml
   ```
5. **Set up Ingress and TLS Certificate**:
   ```bash
   kubectl apply -f cluster-issuer.yaml
   kubectl apply -f ingress.yaml
   ```
6. **Set up Horizontal Pod Autoscaling** (HPA):
   ```bash
   kubectl apply -f backend/backend-hpa.yaml
   ```

### 🔐 DuckDNS & HTTPS
- Use DuckDNS to point your domain (e.g. `taskmgt.duckdns.org`) to your Ingress external IP.
- Configure `cluster-issuer.yaml` with Let’s Encrypt

### 📈 Monitoring
- Logs and metrics are visible in **GCP Logging**
- Visualized via **Grafana** dashboards

---

## ⚙️ CI/CD with GitHub Actions

![CI/CD Diagram](asset/ci-cd-pipeline.png)

We use **GitHub Actions** to automate the build, push, and deployment process on every `main` branch push.

### 🔧 CI/CD Workflow Overview
- Triggers on every push to `main`
- Builds Docker images for both frontend and backend
- Pushes images to Docker Hub
- Deploys to GKE with `kubectl rollout restart deployment frontend` and `kubectl rollout restart deployment backend`

---

## Roadmap and Future Features

- [ ] Add task categories/tags
- [ ] Implement task sharing between users
- [ ] Add email notifications for due tasks
- [ ] Integrate with calendar applications
- [ ] Add task attachments feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
