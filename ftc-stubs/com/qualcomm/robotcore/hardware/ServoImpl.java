package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Mock implementation of Servo that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   ServoImpl servo = new ServoImpl();
 *   servo.setPosition(0.5);
 *   assert servo.getPosition() == 0.5;
 *   assert servo.getCallLog().contains("setPosition(0.5)");
 * </pre>
 */
public class ServoImpl implements Servo {

    /** Log of all method calls made on this servo, in order. */
    public final List<String> callLog = new ArrayList<>();

    private double position = 0.0;
    private Direction direction = Direction.FORWARD;
    private double scaleMin = 0.0;
    private double scaleMax = 1.0;

    public ServoImpl() {
        // Default constructor with sensible defaults
    }

    @Override
    public void setPosition(double position) {
        callLog.add("setPosition(" + position + ")");
        this.position = position;
    }

    @Override
    public double getPosition() {
        callLog.add("getPosition()");
        return position;
    }

    @Override
    public void setDirection(Direction direction) {
        callLog.add("setDirection(" + direction + ")");
        this.direction = direction;
    }

    @Override
    public Direction getDirection() {
        callLog.add("getDirection()");
        return direction;
    }

    @Override
    public void scaleRange(double min, double max) {
        callLog.add("scaleRange(" + min + ", " + max + ")");
        this.scaleMin = min;
        this.scaleMax = max;
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

    /**
     * Returns the current scale minimum.
     * @return the scale minimum
     */
    public double getScaleMin() {
        return scaleMin;
    }

    /**
     * Returns the current scale maximum.
     * @return the scale maximum
     */
    public double getScaleMax() {
        return scaleMax;
    }
}
