#!/bin/bash

IMAGE_NAME="quiz-backend"
CONTAINER_NAME="quiz-backend-container"

echo "🔄 Building Docker image..."
docker build -t $IMAGE_NAME .

# Stop and remove container if it is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🗑 Removing existing container..."
    docker rm $CONTAINER_NAME
fi

echo "🚀 Running container on http://localhost:5001"
docker run --rm -p 5001:5001 --name $CONTAINER_NAME $IMAGE_NAME
