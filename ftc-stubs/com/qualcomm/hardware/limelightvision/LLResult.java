package com.qualcomm.hardware.limelightvision;

import java.util.ArrayList;
import java.util.List;

/**
 * Stub for the FTC SDK LLResult class.
 * Represents a single result snapshot from the Limelight camera.
 *
 * <p>In the sandbox, build a result via the constructor and pass it to
 * {@link Limelight3A#setLatestResult(LLResult)}.
 */
public class LLResult {

    private final boolean valid;
    private final double tx;
    private final double ty;
    private final double ta;
    private final long staleness;
    private final List<LLResultTypes.FiducialResult> fiducialResults;
    private final List<LLResultTypes.ColorResult> colorResults;

    /**
     * Creates a result snapshot.
     *
     * @param valid      whether the result contains a valid target
     * @param tx         horizontal offset from crosshair to target (degrees)
     * @param ty         vertical offset from crosshair to target (degrees)
     * @param ta         target area as % of image
     * @param staleness  milliseconds since this data was captured
     */
    public LLResult(boolean valid, double tx, double ty, double ta, long staleness) {
        this.valid = valid;
        this.tx = tx;
        this.ty = ty;
        this.ta = ta;
        this.staleness = staleness;
        this.fiducialResults = new ArrayList<>();
        this.colorResults = new ArrayList<>();
    }

    /** Returns true if the result contains a valid target. */
    public boolean isValid() {
        return valid;
    }

    /** Horizontal offset from crosshair to best target (degrees). Negative = left. */
    public double getTx() { return tx; }

    /** Vertical offset from crosshair to best target (degrees). Negative = down. */
    public double getTy() { return ty; }

    /** Target area as a percentage of the full image (0.0–100.0). */
    public double getTa() { return ta; }

    /** How many milliseconds old this result is. */
    public long getStaleness() { return staleness; }

    /** Returns all fiducial (AprilTag) detections in this frame. */
    public List<LLResultTypes.FiducialResult> getFiducialResults() {
        return new ArrayList<>(fiducialResults);
    }

    /** Returns all color/blob detections in this frame. */
    public List<LLResultTypes.ColorResult> getColorResults() {
        return new ArrayList<>(colorResults);
    }

    /** Sandbox helper: add a fiducial detection to this result. */
    public void addFiducialResult(LLResultTypes.FiducialResult result) {
        fiducialResults.add(result);
    }

    /** Sandbox helper: add a color detection to this result. */
    public void addColorResult(LLResultTypes.ColorResult result) {
        colorResults.add(result);
    }
}
