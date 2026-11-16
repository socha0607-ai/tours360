#!/usr/bin/env bash
# Automated GCP Cloud Run deployment for Tours360
# Prerequisites:
#   - gcloud SDK installed and authenticated
#   - Project ID set via gcloud config set project <PROJECT_ID>
#   - Dockerfile present at project root (already included)

set -e

# Step 1: Build the container image
IMAGE_NAME="gcr.io/$(gcloud config get-value project)/tours360"
echo "Building Docker image ${IMAGE_NAME}..."
# Use Cloud Build if available, else local Docker
if command -v gcloud >/dev/null && gcloud builds submit --tag ${IMAGE_NAME} .; then
  echo "Image built via Cloud Build"
else
  echo "Falling back to local Docker build"
  docker build -t ${IMAGE_NAME} .
  docker push ${IMAGE_NAME}
fi

# Step 2: Deploy to Cloud Run
SERVICE_NAME="tours360-service"
REGION="asia-south1"  # adjust as needed

echo "Deploying ${SERVICE_NAME} to Cloud Run in region ${REGION}..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --port 8080

echo "Deployment complete. Visit your service at:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format='value(status.url)'
