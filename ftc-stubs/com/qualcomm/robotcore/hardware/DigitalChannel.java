package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK DigitalChannel interface.
 * Provides access to digital I/O channels on the robot controller.
 */
public interface DigitalChannel {

    enum Mode { INPUT, OUTPUT }

    /**
     * Returns the current state of the digital channel.
     * @return true if the channel is high, false if low
     */
    boolean getState();

    /**
     * Sets the state of the digital channel (only valid in OUTPUT mode).
     * @param state true for high, false for low
     */
    void setState(boolean state);

    /**
     * Sets the mode of the digital channel.
     * @param mode INPUT or OUTPUT
     */
    void setMode(Mode mode);

    /**
     * Returns the current mode of the digital channel.
     * @return the current mode
     */
    Mode getMode();
}
