package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Mock implementation of DigitalChannel that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   DigitalChannelImpl touchSensor = new DigitalChannelImpl();
 *   // Default state is true (not pressed for touch sensors)
 *   assert touchSensor.getState() == true;
 *   touchSensor.setState(false); // simulate press
 *   assert touchSensor.getState() == false;
 *   assert touchSensor.getCallLog().contains("setState(false)");
 * </pre>
 */
public class DigitalChannelImpl implements DigitalChannel {

    /** Log of all method calls made on this digital channel, in order. */
    public final List<String> callLog = new ArrayList<>();

    private boolean state = true;  // Default true — not pressed for touch sensors
    private Mode mode = Mode.INPUT;

    public DigitalChannelImpl() {
        // Default constructor with sensible defaults
    }

    @Override
    public boolean getState() {
        callLog.add("getState()");
        return state;
    }

    @Override
    public void setState(boolean state) {
        callLog.add("setState(" + state + ")");
        this.state = state;
    }

    @Override
    public void setMode(Mode mode) {
        callLog.add("setMode(" + mode + ")");
        this.mode = mode;
    }

    @Override
    public Mode getMode() {
        callLog.add("getMode()");
        return mode;
    }

    // --- Test helper methods ---

    /**
     * Returns an unmodifiable view of the call log.
     * @return list of method call strings
     */
    public List<String> getCallLog() {
        return Collections.unmodifiableList(callLog);
    }

    /**
     * Clears the call log.
     */
    public void clearCallLog() {
        callLog.clear();
    }
}
