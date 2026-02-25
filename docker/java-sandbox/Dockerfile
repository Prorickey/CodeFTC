FROM eclipse-temurin:17-jdk-alpine

# Create non-root user
RUN addgroup -S sandbox && adduser -S sandbox -G sandbox

# Create working directories
RUN mkdir -p /app/stubs /app/work && chown -R sandbox:sandbox /app

# Copy pre-compiled FTC stubs (from project root, since build context is project root)
COPY ftc-stubs/ /app/stubs-src/

# Compile the stubs into a classes directory
RUN mkdir -p /app/stubs-classes && \
    find /app/stubs-src -name "*.java" > /tmp/sources.txt && \
    javac -d /app/stubs-classes @/tmp/sources.txt && \
    rm -rf /tmp/sources.txt /app/stubs-src

# Copy entrypoint (path relative to project root build context)
COPY docker/java-sandbox/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER sandbox
WORKDIR /app/work

ENTRYPOINT ["/app/entrypoint.sh"]
