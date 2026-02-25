package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Mock implementation of CRServo that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   CRServoImpl crServo = new CRServoImpl();
 *   crServo.setPower(0.75);
 *   assert crServo.getPower() == 0.75;
 *   assert crServo.getCallLog().contains("setPower(0.75)");
 * </pre>
 */
public class CRServoImpl implements CRServo {

    /** Log of all method calls made on this CR servo, in order. */
    public final List<String> callLog = new ArrayList<>();

    private double power = 0.0;
    private DcMotorSimple.Direction direction = DcMotorSimple.Direction.FORWARD;

    public CRServoImpl() {
        // Default constructor with sensible defaults
    }

    @Override
    public void setPower(double power) {
        callLog.add("setPower(" + power + ")");
        this.power = power;
    }

    @Override
    public double getPower() {
        callLog.add("getPower()");
        return power;
    }

    @Override
    public void setDirection(DcMotorSimple.Direction direction) {
        callLog.add("setDirection(" + direction + ")");
        this.direction = direction;
    }

    @Override
    public DcMotorSimple.Direction getDirection() {
        callLog.add("getDirection()");
        return direction;
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
