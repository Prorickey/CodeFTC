#!/usr/bin/env bash
set -euo pipefail

# Build CheerpJ assets: compile FTC stubs into a JAR (Java 8 target)
# and download OpenJDK 8 tools.jar (contains javac for in-browser compilation).
#
# Output: public/cheerpj/ftc-stubs.jar, public/cheerpj/tools.jar

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUT_DIR="$PROJECT_ROOT/public/cheerpj"
STUBS_DIR="$PROJECT_ROOT/ftc-stubs"
TMP_DIR=$(mktemp -d)

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

mkdir -p "$OUT_DIR"

# ---------------------------------------------------------------------------
# 1. Compile FTC stubs into a JAR targeting Java 8 bytecode
# ---------------------------------------------------------------------------
echo "==> Compiling FTC stubs..."

# Find all Java source files in ftc-stubs/
find "$STUBS_DIR" -name '*.java' > "$TMP_DIR/sources.txt"

CLASSES_DIR="$TMP_DIR/classes"
mkdir -p "$CLASSES_DIR"

javac \
  -source 8 -target 8 \
  -d "$CLASSES_DIR" \
  @"$TMP_DIR/sources.txt"

echo "==> Packaging ftc-stubs.jar..."
jar cf "$OUT_DIR/ftc-stubs.jar" -C "$CLASSES_DIR" .

echo "    Created: $OUT_DIR/ftc-stubs.jar"

# ---------------------------------------------------------------------------
# 2. Download OpenJDK 8 tools.jar (contains com.sun.tools.javac.Main)
# ---------------------------------------------------------------------------
TOOLS_JAR="$OUT_DIR/tools.jar"

if [ -f "$TOOLS_JAR" ]; then
  echo "==> tools.jar already exists, skipping download."
else
  echo "==> Downloading OpenJDK 8 tools.jar..."
  # Adoptium (Eclipse Temurin) JDK 8 — extract tools.jar from the archive.
  # We only need the JAR (not a runnable JDK), so always use x64 which is
  # available on all platforms. JDK 8 has no aarch64 macOS build on Adoptium.
  PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$PLATFORM" in
    darwin) PLATFORM="mac" ;;
  esac

  JDK_URL="https://api.adoptium.net/v3/binary/latest/8/ga/${PLATFORM}/x64/jdk/hotspot/normal/eclipse"
  JDK_ARCHIVE="$TMP_DIR/jdk8.tar.gz"

  echo "    Fetching from Adoptium API..."
  curl -fSL -o "$JDK_ARCHIVE" "$JDK_URL"

  echo "    Extracting tools.jar..."
  # tools.jar is at <jdk-root>/lib/tools.jar inside the archive
  TOOLS_PATH=$(tar tzf "$JDK_ARCHIVE" | grep 'lib/tools\.jar$' | head -1)

  if [ -z "$TOOLS_PATH" ]; then
    echo "ERROR: Could not find tools.jar in JDK archive" >&2
    exit 1
  fi

  tar xzf "$JDK_ARCHIVE" -C "$TMP_DIR" "$TOOLS_PATH"
  cp "$TMP_DIR/$TOOLS_PATH" "$TOOLS_JAR"

  echo "    Created: $TOOLS_JAR"
fi

echo ""
echo "==> CheerpJ assets ready in $OUT_DIR/"
ls -lh "$OUT_DIR/"
