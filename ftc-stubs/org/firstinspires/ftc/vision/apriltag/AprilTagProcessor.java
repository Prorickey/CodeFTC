package org.firstinspires.ftc.vision.apriltag;

import java.util.ArrayList;
import java.util.List;

/**
 * Stub for the FTC SDK AprilTagProcessor.
 * Processes camera frames to detect AprilTags.
 *
 * <p>In the sandbox, pre-seed detections via {@link #addDetection(AprilTagDetection)}.
 */
public class AprilTagProcessor {

    private final List<AprilTagDetection> detections = new ArrayList<>();

    private AprilTagProcessor() {}

    /**
     * Returns the list of AprilTag detections from the most recent frame.
     * In the sandbox this returns whatever was pre-seeded via addDetection().
     */
    public List<AprilTagDetection> getDetections() {
        return new ArrayList<>(detections);
    }

    /**
     * Returns the number of detections from the most recent frame.
     */
    public int getDetectionCount() {
        return detections.size();
    }

    /**
     * Sandbox helper: pre-seed a detection so getDetections() returns it.
     */
    public void addDetection(AprilTagDetection detection) {
        detections.add(detection);
    }

    /** Builder for AprilTagProcessor. Mirrors the real SDK's fluent API. */
    public static class Builder {
        private boolean drawAxes = false;
        private boolean drawCubeProjection = false;
        private boolean drawTagOutline = true;

        public Builder setDrawAxes(boolean draw) {
            this.drawAxes = draw;
            return this;
        }

        public Builder setDrawCubeProjection(boolean draw) {
            this.drawCubeProjection = draw;
            return this;
        }

        public Builder setDrawTagOutline(boolean draw) {
            this.drawTagOutline = draw;
            return this;
        }

        public AprilTagProcessor build() {
            return new AprilTagProcessor();
        }
    }
}
