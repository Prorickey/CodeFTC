package com.qualcomm.robotcore.hardware;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;

/**
 * Mock implementation of DistanceSensor that records all method calls for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   DistanceSensorImpl sensor = new DistanceSensorImpl();
 *   sensor.setDistanceCm(30.0);
 *   assert sensor.getDistance(DistanceUnit.CM) == 30.0;
 *   assert sensor.getDistance(DistanceUnit.MM) == 300.0;
 *   assert sensor.getCallLog().contains("getDistance(CM)");
 * </pre>
 */
public class DistanceSensorImpl implements DistanceSensor {

    /** Log of all method calls made on this distance sensor, in order. */
    public final List<String> callLog = new ArrayList<>();

    private double distanceCm = 0.0;

    public DistanceSensorImpl() {
        // Default constructor with sensible defaults
    }

    @Override
    public double getDistance(DistanceUnit unit) {
        callLog.add("getDistance(" + unit + ")");
        return unit.fromCm(distanceCm);
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
     * Directly set the simulated distance in centimeters (for test setup).
     * @param cm the distance in centimeters
     */
    public void setDistanceCm(double cm) {
        this.distanceCm = cm;
    }
}
