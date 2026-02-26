package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK VoltageSensor interface.
 * Represents a hardware device that can measure voltage (e.g., the Control Hub battery).
 */
public interface VoltageSensor {
    /**
     * Returns the current measured voltage.
     *
     * @return voltage in volts
     */
    double getVoltage();
}
