package com.qualcomm.hardware.limelightvision;

/**
 * Stub for the FTC SDK Limelight3A class.
 * Provides access to the Limelight 3A vision coprocessor via I2C.
 *
 * <p>In the sandbox, pre-seed a result via {@link #setLatestResult(LLResult)}.
 *
 * <p>Typical usage:
 * <pre>
 *   Limelight3A limelight = hardwareMap.get(Limelight3A.class, "limelight");
 *   limelight.pipelineSwitch(0);
 *   limelight.start();
 *
 *   LLResult result = limelight.getLatestResult();
 *   if (result != null && result.isValid()) {
 *       double tx = result.getTx();
 *       double ty = result.getTy();
 *   }
 * </pre>
 */
public class Limelight3A {

    private boolean running = false;
    private int currentPipeline = 0;
    private LLResult latestResult = null;

    public Limelight3A() {}

    /**
     * Starts the Limelight streaming and processing pipeline.
     * Must be called before getLatestResult() will return data.
     */
    public void start() {
        running = true;
    }

    /**
     * Pauses the Limelight to save resources.
     */
    public void stop() {
        running = false;
    }

    /**
     * Switches to the specified pipeline index (0–9).
     * @param pipelineIndex the pipeline to activate
     */
    public void pipelineSwitch(int pipelineIndex) {
        this.currentPipeline = pipelineIndex;
    }

    /** Returns the currently active pipeline index. */
    public int getCurrentPipelineIndex() {
        return currentPipeline;
    }

    /** Returns true if the Limelight is currently streaming. */
    public boolean isRunning() {
        return running;
    }

    /**
     * Returns the most recent result from the Limelight, or null if
     * the Limelight is not running or no frame has been received.
     */
    public LLResult getLatestResult() {
        if (!running) return null;
        return latestResult;
    }

    /**
     * Sandbox helper: pre-seed the result that getLatestResult() will return.
     * @param result the result to return, or null to simulate no target
     */
    public void setLatestResult(LLResult result) {
        this.latestResult = result;
    }
}
