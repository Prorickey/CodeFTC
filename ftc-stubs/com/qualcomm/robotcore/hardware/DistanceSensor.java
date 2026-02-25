package com.qualcomm.robotcore.hardware;

import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;

/**
 * Stub for the FTC SDK DistanceSensor interface.
 * Provides distance measurement from a sensor.
 */
public interface DistanceSensor {

    /**
     * Returns the distance measured by the sensor in the specified unit.
     * @param unit the desired distance unit
     * @return the distance in the specified unit
     */
    double getDistance(DistanceUnit unit);
}
