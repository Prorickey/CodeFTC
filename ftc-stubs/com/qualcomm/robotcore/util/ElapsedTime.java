package com.qualcomm.robotcore.util;

/**
 * Stub for the FTC SDK ElapsedTime class.
 * A simple timer utility for measuring elapsed time.
 *
 * <p>Usage in tests:
 * <pre>
 *   ElapsedTime timer = new ElapsedTime();
 *   // ... do some work ...
 *   double elapsed = timer.seconds();
 *   timer.reset(); // restart the timer
 * </pre>
 */
public class ElapsedTime {
    private long startTime;

    /**
     * Creates an ElapsedTime instance and starts the timer.
     */
    public ElapsedTime() {
        reset();
    }

    /**
     * Resets the timer to zero.
     */
    public void reset() {
        startTime = System.nanoTime();
    }

    /**
     * Returns the elapsed time in seconds.
     * @return elapsed time in seconds
     */
    public double seconds() {
        return (System.nanoTime() - startTime) / 1_000_000_000.0;
    }

    /**
     * Returns the elapsed time in milliseconds.
     * @return elapsed time in milliseconds
     */
    public double milliseconds() {
        return (System.nanoTime() - startTime) / 1_000_000.0;
    }

    /**
     * Returns the elapsed time in seconds. Alias for {@link #seconds()}.
     * @return elapsed time in seconds
     */
    public double time() {
        return seconds();
    }
}
