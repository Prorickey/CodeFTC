package org.firstinspires.ftc.vision.apriltag;

/**
 * Stub for the FTC SDK AprilTagPoseFtc class.
 * Represents the pose of a detected AprilTag relative to the robot's camera,
 * expressed in FTC-convention units (inches and degrees by default).
 */
public class AprilTagPoseFtc {
    /** Lateral offset from camera center — positive is right (inches). */
    public double x;
    /** Forward distance from camera (inches). */
    public double y;
    /** Vertical offset from camera center — positive is up (inches). */
    public double z;
    /** Roll angle of the tag (degrees). */
    public double roll;
    /** Pitch angle of the tag (degrees). */
    public double pitch;
    /** Yaw angle of the tag — rotation around vertical axis (degrees). */
    public double yaw;
    /** Straight-line distance from camera to tag center (inches). */
    public double range;
    /** Horizontal angle to tag — positive is left (degrees). */
    public double bearing;
    /** Vertical angle to tag — positive is up (degrees). */
    public double elevation;

    public AprilTagPoseFtc() {}

    public AprilTagPoseFtc(double x, double y, double z,
                            double roll, double pitch, double yaw,
                            double range, double bearing, double elevation) {
        this.x = x; this.y = y; this.z = z;
        this.roll = roll; this.pitch = pitch; this.yaw = yaw;
        this.range = range; this.bearing = bearing; this.elevation = elevation;
    }
}
