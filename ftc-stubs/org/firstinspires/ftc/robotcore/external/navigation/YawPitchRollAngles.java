package org.firstinspires.ftc.robotcore.external.navigation;

/**
 * Stub for the FTC SDK YawPitchRollAngles class.
 * Stores orientation angles and provides access in various angle units.
 */
public class YawPitchRollAngles {
    private final double yaw;
    private final double pitch;
    private final double roll;

    /**
     * Creates a YawPitchRollAngles instance with the given angles in degrees.
     * @param yawDegrees the yaw angle in degrees
     * @param pitchDegrees the pitch angle in degrees
     * @param rollDegrees the roll angle in degrees
     */
    public YawPitchRollAngles(double yawDegrees, double pitchDegrees, double rollDegrees) {
        this.yaw = yawDegrees;
        this.pitch = pitchDegrees;
        this.roll = rollDegrees;
    }

    /**
     * Returns the yaw angle in the specified unit.
     * @param unit the desired angle unit
     * @return the yaw angle
     */
    public double getYaw(AngleUnit unit) {
        return unit.fromDegrees(yaw);
    }

    /**
     * Returns the pitch angle in the specified unit.
     * @param unit the desired angle unit
     * @return the pitch angle
     */
    public double getPitch(AngleUnit unit) {
        return unit.fromDegrees(pitch);
    }

    /**
     * Returns the roll angle in the specified unit.
     * @param unit the desired angle unit
     * @return the roll angle
     */
    public double getRoll(AngleUnit unit) {
        return unit.fromDegrees(roll);
    }
}
