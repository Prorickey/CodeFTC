#!/bin/sh
set -e

CLASSPATH="/app/stubs-classes"
WORK="/app/work"

# Compile student code + lesson test class
COMPILE_OUTPUT=$(javac -cp "$CLASSPATH" -d "$WORK/out" "$WORK"/*.java 2>&1) || {
    # Compilation failed — output JSON error
    ESCAPED=$(echo "$COMPILE_OUTPUT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
    echo "{\"success\":false,\"compilationError\":\"$ESCAPED\",\"testResults\":[]}"
    exit 0
}

# Run the lesson's Test class with timeout
RESULT=$(timeout 15 java -cp "$CLASSPATH:$WORK/out" -Xmx128m Test 2>&1) || {
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "{\"success\":false,\"runtimeError\":\"Execution timed out (15 second limit)\",\"timeout\":true,\"testResults\":[]}"
    else
        ESCAPED=$(echo "$RESULT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        echo "{\"success\":false,\"runtimeError\":\"$ESCAPED\",\"testResults\":[]}"
    fi
    exit 0
}

echo "$RESULT"
