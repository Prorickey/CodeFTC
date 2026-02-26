package org.firstinspires.ftc.vision.apriltag;

/**
 * Stub for the FTC SDK AprilTagDetection class.
 * Represents a single detected AprilTag in a camera frame.
 */
public class AprilTagDetection {
    /** The numeric ID of the detected tag. */
    public int id;

    /**
     * Number of bit errors corrected during decoding.
     * 0 means a perfect read; higher values mean less confidence.
     */
    public int hamming;

    /**
     * Confidence score for the detection.
     * Higher is better; values below ~35 are considered unreliable.
     */
    public float decisionMargin;

    /**
     * The pose of the tag relative to the robot camera.
     * This is null if no tag library was set on the processor.
     */
    public AprilTagPoseFtc ftcPose;

    public AprilTagDetection() {}

    public AprilTagDetection(int id, float decisionMargin, AprilTagPoseFtc ftcPose) {
        this.id = id;
        this.hamming = 0;
        this.decisionMargin = decisionMargin;
        this.ftcPose = ftcPose;
    }
}
