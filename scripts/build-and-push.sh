#!/bin/bash

REGISTRY="docker.bedson.tech/tbedson"

echo "Building Next.js image..."

docker build -t "$REGISTRY/codeftc-nextjs:latest" -f Dockerfile .
[ $? -ne 0 ] && { echo "ERROR: codeftc-nextjs build failed"; exit 1; }

echo "Pushing Next.js image..."

docker push "$REGISTRY/codeftc-nextjs:latest"
[ $? -ne 0 ] && { echo "ERROR: codeftc-nextjs push failed"; exit 1; }

echo "Done."
