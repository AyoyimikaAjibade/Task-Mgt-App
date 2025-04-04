#!/bin/bash

PROJECT_ID="tranquil-lore-449501-j8"
IMAGE_NAME="us-central1-docker.pkg.dev/$PROJECT_ID/task-mgt-app/backend"

echo "🧼 Cleaning previous dist folder..."
rm -rf ./backend/dist

echo "🐳 Building fresh Docker image for backend..."
docker build --no-cache -t $IMAGE_NAME ./backend

echo "📦 Pushing image to Artifact Registry..."
docker push $IMAGE_NAME

echo "🚀 Restarting backend deployment in Kubernetes..."
kubectl rollout restart deployment backend

echo "✅ Done!"
