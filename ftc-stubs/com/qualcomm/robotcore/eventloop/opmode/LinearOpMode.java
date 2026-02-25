package com.qualcomm.robotcore.eventloop.opmode;

import com.qualcomm.robotcore.hardware.Gamepad;
import com.qualcomm.robotcore.hardware.HardwareMap;
import org.firstinspires.ftc.robotcore.external.Telemetry;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Stub for the FTC SDK LinearOpMode abstract class.
 * This is the base class for linear (sequential) OpModes.
 *
 * <p>Subclasses must implement {@link #runOpMode()}, which contains the
 * sequential logic of the OpMode.
 *
 * <p>This mock tracks all method calls for test assertions. The opMode
 * can be configured to simulate various states (started, stop requested, etc.)
 * for testing different code paths.
 *
 * <p>Usage in tests:
 * <pre>
 *   // Create a concrete subclass
 *   MyOpMode opMode = new MyOpMode();
 *   DcMotorImpl motor = new DcMotorImpl();
 *   opMode.hardwareMap.registerDevice("motor", motor);
 *
 *   // Simulate that the opMode has started
 *   opMode.setStarted(true);
 *
 *   // Run the user's code
 *   opMode.runOpMode();
 *
 *   // Assert behavior
 *   assert opMode.getCallLog().contains("waitForStart()");
 *   assert motor.getPower() == 1.0;
 * </pre>
 */
public abstract class LinearOpMode {

    /** The hardware map for accessing robot hardware devices. */
    public HardwareMap hardwareMap = new HardwareMap();

    /** Telemetry for sending data to the Driver Station. */
    public Telemetry telemetry = new TelemetryImpl();

    /** Gamepad 1 (typically the driver). */
    public Gamepad gamepad1 = new Gamepad();

    /** Gamepad 2 (typically the operator). */
    public Gamepad gamepad2 = new Gamepad();

    /** Ordered log of all framework method calls. */
    private final List<String> callLog = new ArrayList<>();

    /** Whether the opMode has been started (START button pressed). */
    private boolean started = false;

    /** Whether a stop has been requested. */
    private boolean stopRequested = false;

    /** Maximum number of opModeIsActive() calls that return true (prevents infinite loops). */
    private int maxActiveLoops = 100;

    /** Counter for opModeIsActive() calls. */
    private int activeLoopCount = 0;

    /**
     * Contains the sequential logic of the OpMode.
     * Subclasses must implement this method.
     *
     * <p>Typical structure:
     * <pre>
     *   public void runOpMode() {
     *       // Initialize hardware
     *       DcMotor motor = hardwareMap.get(DcMotor.class, "motor");
     *
     *       waitForStart();
     *
     *       while (opModeIsActive()) {
     *           motor.setPower(gamepad1.left_stick_y);
     *           telemetry.addData("Power", motor.getPower());
     *           telemetry.update();
     *       }
     *   }
     * </pre>
     */
    public abstract void runOpMode();

    /**
     * Pauses the linear OpMode until START is pressed on the Driver Station.
     * In this mock, it simply records the call.
     */
    public void waitForStart() {
        callLog.add("waitForStart()");
        // In the mock, this does not actually block.
        // Tests should set started = true before calling runOpMode().
    }

    /**
     * Sleeps for the given number of milliseconds.
     * In this mock, it records the call but does NOT actually sleep
     * (to keep tests fast).
     *
     * @param milliseconds the duration to sleep
     */
    public void sleep(long milliseconds) {
        callLog.add("sleep(" + milliseconds + ")");
        // Intentionally does not actually sleep in the mock.
    }

    /**
     * Returns whether the OpMode is active (started and not stop-requested).
     * In this mock, it also enforces a maximum loop count to prevent infinite loops
     * in tests.
     *
     * @return true if the OpMode is active
     */
    public boolean opModeIsActive() {
        callLog.add("opModeIsActive()");
        if (!started || stopRequested) {
            return false;
        }
        activeLoopCount++;
        if (activeLoopCount > maxActiveLoops) {
            return false;
        }
        return true;
    }

    /**
     * Returns whether the OpMode has been started.
     * @return true if START has been pressed
     */
    public boolean isStarted() {
        callLog.add("isStarted()");
        return started;
    }

    /**
     * Returns whether a stop has been requested.
     * @return true if stop has been requested
     */
    public boolean isStopRequested() {
        callLog.add("isStopRequested()");
        return stopRequested;
    }

    /**
     * Allows other threads to run. In this mock, it simply records the call.
     */
    public void idle() {
        callLog.add("idle()");
    }

    /**
     * Returns the time in seconds since the OpMode was started.
     * In this mock, returns 0.0.
     * @return elapsed time in seconds
     */
    public double getRuntime() {
        return 0.0;
    }

    /**
     * Resets the runtime clock.
     */
    public void resetRuntime() {
        callLog.add("resetRuntime()");
    }

    // --- Test helper methods (not in the real FTC SDK) ---

    /**
     * Returns an unmodifiable view of the call log.
     * @return list of method call strings in order
     */
    public List<String> getCallLog() {
        return Collections.unmodifiableList(callLog);
    }

    /**
     * Clears the call log.
     */
    public void clearCallLog() {
        callLog.clear();
    }

    /**
     * Sets whether the OpMode should report as started.
     * Call this with true before runOpMode() to simulate the START button.
     *
     * @param started true if the OpMode should be started
     */
    public void setStarted(boolean started) {
        this.started = started;
    }

    /**
     * Sets whether a stop has been requested.
     * Use this to simulate the STOP button during test execution.
     *
     * @param stopRequested true if stop should be requested
     */
    public void setStopRequested(boolean stopRequested) {
        this.stopRequested = stopRequested;
    }

    /**
     * Sets the maximum number of times opModeIsActive() will return true.
     * This prevents infinite loops in tests. Default is 100.
     *
     * @param maxLoops the maximum number of active loop iterations
     */
    public void setMaxActiveLoops(int maxLoops) {
        this.maxActiveLoops = maxLoops;
    }

    /**
     * Returns the number of times opModeIsActive() has been called
     * and returned true.
     *
     * @return the active loop count
     */
    public int getActiveLoopCount() {
        return activeLoopCount;
    }

    /**
     * Resets the active loop counter to zero.
     */
    public void resetActiveLoopCount() {
        activeLoopCount = 0;
    }
}
