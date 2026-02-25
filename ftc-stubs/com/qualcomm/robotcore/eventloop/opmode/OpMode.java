package com.qualcomm.robotcore.eventloop.opmode;

import com.qualcomm.robotcore.hardware.Gamepad;
import com.qualcomm.robotcore.hardware.HardwareMap;
import org.firstinspires.ftc.robotcore.external.Telemetry;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Stub for the FTC SDK OpMode abstract class.
 * This is the base class for iterative (non-linear) OpModes.
 *
 * <p>Subclasses must implement {@link #init()} and {@link #loop()}.
 * Optionally override {@link #init_loop()}, {@link #start()}, and {@link #stop()}.
 *
 * <p>This mock tracks method calls for test assertions.
 */
public abstract class OpMode {

    /** The hardware map for accessing robot hardware devices. */
    public HardwareMap hardwareMap = new HardwareMap();

    /** Telemetry for sending data to the Driver Station. */
    public Telemetry telemetry = new TelemetryImpl();

    /** Gamepad 1 (typically the driver). */
    public Gamepad gamepad1 = new Gamepad();

    /** Gamepad 2 (typically the operator). */
    public Gamepad gamepad2 = new Gamepad();

    /** Log of lifecycle method calls, in order. */
    private final List<String> callLog = new ArrayList<>();

    /** Time in milliseconds since the OpMode was initialized. */
    private long startTime = System.currentTimeMillis();

    /**
     * Called once when the INIT button is pressed.
     * Subclasses must implement this.
     */
    public abstract void init();

    /**
     * Called repeatedly while waiting for START after init.
     * Override to add initialization loop behavior.
     */
    public void init_loop() {
        callLog.add("init_loop()");
    }

    /**
     * Called once when the START button is pressed.
     * Override to add start behavior.
     */
    public void start() {
        callLog.add("start()");
        startTime = System.currentTimeMillis();
    }

    /**
     * Called repeatedly while the OpMode is running.
     * Subclasses must implement this.
     */
    public abstract void loop();

    /**
     * Called once when the OpMode is stopped.
     * Override to add cleanup behavior.
     */
    public void stop() {
        callLog.add("stop()");
    }

    /**
     * Returns the time in seconds since the OpMode was started.
     * @return elapsed time in seconds
     */
    public double getRuntime() {
        return (System.currentTimeMillis() - startTime) / 1000.0;
    }

    /**
     * Resets the runtime clock to zero.
     */
    public void resetRuntime() {
        startTime = System.currentTimeMillis();
        callLog.add("resetRuntime()");
    }

    // --- Test helper methods ---

    /**
     * Returns an unmodifiable view of the lifecycle call log.
     * @return list of method call strings
     */
    public List<String> getCallLog() {
        return Collections.unmodifiableList(callLog);
    }

    /**
     * Clears the lifecycle call log.
     */
    public void clearCallLog() {
        callLog.clear();
    }

    /**
     * Simulates the full OpMode lifecycle for testing:
     * init() -> init_loop() (loopCount times) -> start() -> loop() (loopCount times) -> stop()
     *
     * @param initLoopCount number of init_loop iterations
     * @param mainLoopCount number of main loop iterations
     */
    public void simulateLifecycle(int initLoopCount, int mainLoopCount) {
        callLog.add("init()");
        init();
        for (int i = 0; i < initLoopCount; i++) {
            init_loop();
        }
        start();
        for (int i = 0; i < mainLoopCount; i++) {
            callLog.add("loop()");
            loop();
        }
        stop();
    }
}
