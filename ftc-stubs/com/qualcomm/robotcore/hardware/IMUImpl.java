package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

/**
 * Mock implementation of IMU that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   IMUImpl imu = new IMUImpl();
 *   imu.setYaw(90.0);
 *   YawPitchRollAngles angles = imu.getRobotYawPitchRollAngles();
 *   assert angles.getYaw(AngleUnit.DEGREES) == 90.0;
 *   imu.resetYaw();
 *   angles = imu.getRobotYawPitchRollAngles();
 *   assert angles.getYaw(AngleUnit.DEGREES) == 0.0;
 * </pre>
 */
public class IMUImpl implements IMU {

    /** Log of all method calls made on this IMU, in order. */
    public final List<String> callLog = new ArrayList<>();

    private double yaw = 0.0;
    private double pitch = 0.0;
    private double roll = 0.0;

    public IMUImpl() {
        // Default constructor with sensible defaults
    }

    @Override
    public void initialize(Parameters parameters) {
        callLog.add("initialize()");
    }

    @Override
    public void resetYaw() {
        callLog.add("resetYaw()");
        this.yaw = 0.0;
    }

    @Override
    public YawPitchRollAngles getRobotYawPitchRollAngles() {
        callLog.add("getRobotYawPitchRollAngles()");
        return new YawPitchRollAngles(yaw, pitch, roll);
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
     * Set the simulated yaw angle in degrees (for test setup).
     * @param yawDegrees the yaw angle in degrees
     */
    public void setYaw(double yawDegrees) {
        this.yaw = yawDegrees;
    }

    /**
     * Set the simulated pitch angle in degrees (for test setup).
     * @param pitchDegrees the pitch angle in degrees
     */
    public void setPitch(double pitchDegrees) {
        this.pitch = pitchDegrees;
    }

    /**
     * Set the simulated roll angle in degrees (for test setup).
     * @param rollDegrees the roll angle in degrees
     */
    public void setRoll(double rollDegrees) {
        this.roll = rollDegrees;
    }
}
