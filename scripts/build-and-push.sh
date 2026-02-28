#!/bin/bash

REGISTRY="docker.bedson.tech/tbedson"

echo "Building images in parallel..."

docker build -t "$REGISTRY/codeftc-nextjs:latest" -f Dockerfile . &
NEXTJS_BUILD_PID=$!

docker build -t "$REGISTRY/codeftc-java-sandbox:latest" -f docker/java-sandbox/Dockerfile . &
SANDBOX_BUILD_PID=$!

FAILED=0
wait $NEXTJS_BUILD_PID  || { echo "ERROR: codeftc-nextjs build failed";     FAILED=1; }
wait $SANDBOX_BUILD_PID || { echo "ERROR: codeftc-java-sandbox build failed"; FAILED=1; }
[ $FAILED -ne 0 ] && exit 1

echo "Pushing images in parallel..."

docker push "$REGISTRY/codeftc-nextjs:latest" &
NEXTJS_PUSH_PID=$!

docker push "$REGISTRY/codeftc-java-sandbox:latest" &
SANDBOX_PUSH_PID=$!

FAILED=0
wait $NEXTJS_PUSH_PID  || { echo "ERROR: codeftc-nextjs push failed";     FAILED=1; }
wait $SANDBOX_PUSH_PID || { echo "ERROR: codeftc-java-sandbox push failed"; FAILED=1; }
[ $FAILED -ne 0 ] && exit 1

echo "Done."
