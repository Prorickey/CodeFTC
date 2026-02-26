package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK HardwareDevice interface.
 * Base interface for all hardware devices accessible through HardwareMap.
 */
public interface HardwareDevice {
    /** Returns a short human-readable name for this device type. */
    String getDeviceName();

    /** Returns a string describing the manufacturer of this device. */
    String getManufacturer();

    /** Closes the device and releases any resources it holds. */
    void close();
}
