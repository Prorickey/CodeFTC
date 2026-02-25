package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK DcMotorSimple interface.
 * Provides basic motor control methods shared by all DC motor types.
 */
public interface DcMotorSimple {

    enum Direction {
        FORWARD,
        REVERSE
    }

    /**
     * Sets the motor power.
     * @param power motor power, a value in the range [-1.0, 1.0]
     */
    void setPower(double power);

    /**
     * Returns the current motor power.
     * @return current motor power, a value in the range [-1.0, 1.0]
     */
    double getPower();

    /**
     * Sets the logical direction of the motor.
     * @param direction the direction to set
     */
    void setDirection(Direction direction);

    /**
     * Returns the current logical direction of the motor.
     * @return the current direction
     */
    Direction getDirection();
}
