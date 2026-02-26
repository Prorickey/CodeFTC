package com.qualcomm.robotcore.hardware;

/**
 * Stub implementation of VoltageSensor for use in tests.
 * Voltage can be set explicitly to simulate battery state.
 */
public class VoltageSensorImpl implements VoltageSensor {

    private double voltage;

    public VoltageSensorImpl(double voltage) {
        this.voltage = voltage;
    }

    public void setVoltage(double voltage) {
        this.voltage = voltage;
    }

    @Override
    public double getVoltage() {
        return voltage;
    }
}
