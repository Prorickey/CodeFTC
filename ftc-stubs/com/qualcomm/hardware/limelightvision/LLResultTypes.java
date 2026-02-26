package com.qualcomm.hardware.limelightvision;

/**
 * Stub for the FTC SDK LLResultTypes class.
 * Contains inner classes for each type of Limelight detection result.
 */
public class LLResultTypes {

    /**
     * Represents a single fiducial (AprilTag) detection from the Limelight.
     */
    public static class FiducialResult {
        private final int fiducialId;
        private final double targetXDegrees;
        private final double targetYDegrees;
        private final double ta;

        public FiducialResult(int fiducialId, double targetXDegrees, double targetYDegrees, double ta) {
            this.fiducialId = fiducialId;
            this.targetXDegrees = targetXDegrees;
            this.targetYDegrees = targetYDegrees;
            this.ta = ta;
        }

        /** Returns the AprilTag / fiducial ID. */
        public int getFiducialId() {
            return fiducialId;
        }

        /** Returns the horizontal offset to the target in degrees. Negative is left. */
        public double getTargetXDegrees() {
            return targetXDegrees;
        }

        /** Returns the vertical offset to the target in degrees. Negative is down. */
        public double getTargetYDegrees() {
            return targetYDegrees;
        }

        /** Returns the target area as a percentage of the image (0.0–100.0). */
        public double getTargetArea() {
            return ta;
        }
    }

    /**
     * Represents a color/blob detection result from the Limelight.
     */
    public static class ColorResult {
        private final double targetXDegrees;
        private final double targetYDegrees;
        private final double ta;

        public ColorResult(double targetXDegrees, double targetYDegrees, double ta) {
            this.targetXDegrees = targetXDegrees;
            this.targetYDegrees = targetYDegrees;
            this.ta = ta;
        }

        public double getTargetXDegrees() { return targetXDegrees; }
        public double getTargetYDegrees() { return targetYDegrees; }
        public double getTargetArea()     { return ta; }
    }
}
