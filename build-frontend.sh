#!/bin/bash

# Config
PROJECT_ID="tranquil-lore-449501-j8"
REGION="us-central1"
REPO="task-mgt-app"
IMAGE_NAME="frontend"
BACKEND_URL="http://backend-service:3001"

# Full image path
IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE_NAME"

echo "🧼 Cleaning previous build (if any)..."
rm -rf ./frontend/build ./frontend/dist

echo "🐳 Building frontend image..."
docker build --no-cache \
  --build-arg REACT_APP_API_URL=$BACKEND_URL \
  -t $IMAGE_URI \
  ./frontend

echo "📦 Pushing image to Google Artifact Registry..."
docker push $IMAGE_URI

echo "🚀 Restarting frontend deployment in Kubernetes..."
kubectl rollout restart deployment frontend

echo "✅ Done! Check your app via the frontend EXTERNAL-IP."

