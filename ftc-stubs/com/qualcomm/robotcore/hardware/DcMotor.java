package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK DcMotor interface.
 * Extends DcMotorSimple with encoder-related functionality.
 */
public interface DcMotor extends DcMotorSimple {

    enum RunMode {
        RUN_WITHOUT_ENCODER,
        RUN_USING_ENCODER,
        RUN_TO_POSITION,
        STOP_AND_RESET_ENCODER
    }

    // Direction is inherited from DcMotorSimple

    /**
     * Sets the run mode for the motor.
     * @param mode the desired run mode
     */
    void setMode(RunMode mode);

    /**
     * Returns the current run mode.
     * @return the current run mode
     */
    RunMode getMode();

    /**
     * Returns the current position of the motor encoder.
     * @return the current encoder position in ticks
     */
    int getCurrentPosition();

    /**
     * Sets the target position for RUN_TO_POSITION mode.
     * @param position the target position in encoder ticks
     */
    void setTargetPosition(int position);

    /**
     * Returns the target position.
     * @return the target position in encoder ticks
     */
    int getTargetPosition();

    /**
     * Returns whether the motor is currently busy (moving to target).
     * @return true if the motor is busy
     */
    boolean isBusy();
}
