#!/bin/bash
set -e

REGISTRY="docker.bedson.tech/tbedson"

echo "Building codeftc-nextjs..."
docker build -t "$REGISTRY/codeftc-nextjs:latest" -f Dockerfile .

echo "Building codeftc-java-sandbox..."
docker build -t "$REGISTRY/codeftc-java-sandbox:latest" -f docker/java-sandbox/Dockerfile .

echo "Pushing codeftc-nextjs..."
docker push "$REGISTRY/codeftc-nextjs:latest"

echo "Pushing codeftc-java-sandbox..."
docker push "$REGISTRY/codeftc-java-sandbox:latest"

echo "Done."
