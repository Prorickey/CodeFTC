package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK CRServo interface.
 * Controls a continuous rotation servo.
 */
public interface CRServo {

    /**
     * Sets the power of the continuous rotation servo.
     * @param power the power, a value in the range [-1.0, 1.0]
     */
    void setPower(double power);

    /**
     * Returns the current power of the continuous rotation servo.
     * @return the current power in the range [-1.0, 1.0]
     */
    double getPower();

    /**
     * Sets the logical direction of the servo.
     * @param direction the direction to set
     */
    void setDirection(DcMotorSimple.Direction direction);

    /**
     * Returns the current logical direction of the servo.
     * @return the current direction
     */
    DcMotorSimple.Direction getDirection();
}
