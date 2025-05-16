#!/bin/bash

IMAGE_NAME="quiz-backend"
CONTAINER_NAME_PATTERN="quiz-backend"

echo "🛑 Stopping containers matching '$CONTAINER_NAME_PATTERN'..."
docker ps -q --filter "name=$CONTAINER_NAME_PATTERN" | xargs -r docker stop

echo "🗑 Removing containers matching '$CONTAINER_NAME_PATTERN'..."
docker ps -aq --filter "name=$CONTAINER_NAME_PATTERN" | xargs -r docker rm

echo "🗑 Removing images named '$IMAGE_NAME'..."
docker images -q $IMAGE_NAME | xargs -r docker rmi -f

echo "✅ Clean up for '$IMAGE_NAME' project done."
