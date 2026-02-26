package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK WebcamName interface.
 * Represents a USB webcam attached to the Control Hub or phone.
 */
public interface WebcamName extends HardwareDevice {
    /** Returns true if a webcam with this name is currently attached. */
    boolean isAttached();
}
