package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK DcMotorEx interface.
 * Extends DcMotor with velocity control and other advanced features.
 */
public interface DcMotorEx extends DcMotor {

    /**
     * Sets the motor velocity in encoder ticks per second.
     * Only meaningful in RUN_USING_ENCODER mode.
     * @param ticksPerSecond target velocity in ticks/second
     */
    void setVelocity(double ticksPerSecond);

    /**
     * Returns the current motor velocity in encoder ticks per second.
     * @return velocity in ticks/second
     */
    double getVelocity();

    /** Enable the motor. */
    void setMotorEnable();

    /** Disable the motor. */
    void setMotorDisable();

    /** @return true if the motor is enabled */
    boolean isMotorEnabled();
}
