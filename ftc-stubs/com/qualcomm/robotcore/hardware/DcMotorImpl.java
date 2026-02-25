package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Mock implementation of DcMotor that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   DcMotorImpl motor = new DcMotorImpl();
 *   motor.setPower(0.5);
 *   assert motor.getPower() == 0.5;
 *   assert motor.getCallLog().contains("setPower(0.5)");
 * </pre>
 */
public class DcMotorImpl implements DcMotor {

    /** Log of all method calls made on this motor, in order. */
    public final List<String> callLog = new ArrayList<>();

    private double power = 0.0;
    private Direction direction = Direction.FORWARD;
    private RunMode mode = RunMode.RUN_WITHOUT_ENCODER;
    private int currentPosition = 0;
    private int targetPosition = 0;
    private boolean busy = false;

    public DcMotorImpl() {
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
    public void setMode(RunMode mode) {
        callLog.add("setMode(" + mode + ")");
        this.mode = mode;
        if (mode == RunMode.STOP_AND_RESET_ENCODER) {
            currentPosition = 0;
        }
    }

    @Override
    public RunMode getMode() {
        callLog.add("getMode()");
        return mode;
    }

    @Override
    public int getCurrentPosition() {
        callLog.add("getCurrentPosition()");
        return currentPosition;
    }

    @Override
    public void setTargetPosition(int position) {
        callLog.add("setTargetPosition(" + position + ")");
        this.targetPosition = position;
    }

    @Override
    public int getTargetPosition() {
        callLog.add("getTargetPosition()");
        return targetPosition;
    }

    @Override
    public boolean isBusy() {
        callLog.add("isBusy()");
        return busy;
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
     * Directly set the simulated encoder position (for test setup).
     * @param position the encoder position in ticks
     */
    public void setCurrentPosition(int position) {
        this.currentPosition = position;
    }

    /**
     * Set whether the motor reports as busy (for test setup).
     * @param busy true if the motor should report busy
     */
    public void setBusy(boolean busy) {
        this.busy = busy;
    }
}
