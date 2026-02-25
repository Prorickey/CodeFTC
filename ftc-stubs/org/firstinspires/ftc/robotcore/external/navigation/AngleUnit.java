package org.firstinspires.ftc.robotcore.external.navigation;

/**
 * Stub for the FTC SDK AngleUnit enum.
 * Represents units of angle measurement with conversion utilities.
 */
public enum AngleUnit {
    DEGREES, RADIANS;

    /**
     * Converts an angle in degrees to this unit.
     * @param degrees the angle in degrees
     * @return the angle in this unit
     */
    public double fromDegrees(double degrees) {
        switch (this) {
            case DEGREES: return degrees;
            case RADIANS: return Math.toRadians(degrees);
            default: return degrees;
        }
    }

    /**
     * Converts an angle in radians to this unit.
     * @param radians the angle in radians
     * @return the angle in this unit
     */
    public double fromRadians(double radians) {
        switch (this) {
            case DEGREES: return Math.toDegrees(radians);
            case RADIANS: return radians;
            default: return radians;
        }
    }
}
