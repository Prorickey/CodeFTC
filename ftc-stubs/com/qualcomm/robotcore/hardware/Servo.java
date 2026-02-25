package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK Servo interface.
 * Controls a standard hobby servo.
 */
public interface Servo {

    enum Direction {
        FORWARD,
        REVERSE
    }

    /**
     * Sets the servo position.
     * @param position the position, a value in the range [0.0, 1.0]
     */
    void setPosition(double position);

    /**
     * Returns the current servo position.
     * @return the current position in the range [0.0, 1.0]
     */
    double getPosition();

    /**
     * Sets the logical direction of the servo.
     * @param direction the direction to set
     */
    void setDirection(Direction direction);

    /**
     * Returns the current logical direction of the servo.
     * @return the current direction
     */
    Direction getDirection();

    /**
     * Scales the range of the servo.
     * @param min the minimum position (0.0 to 1.0)
     * @param max the maximum position (0.0 to 1.0)
     */
    void scaleRange(double min, double max);
}
