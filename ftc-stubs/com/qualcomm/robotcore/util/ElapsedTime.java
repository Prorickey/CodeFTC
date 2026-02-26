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

    public enum Resolution {
        SECONDS,
        MILLISECONDS
    }

    public static final long SECOND_IN_NANO = 1_000_000_000L;
    public static final long MILLIS_IN_NANO  = 1_000_000L;

    private long startTime;
    private Resolution resolution;

    /**
     * Creates an ElapsedTime instance with SECONDS resolution and starts the timer.
     */
    public ElapsedTime() {
        resolution = Resolution.SECONDS;
        reset();
    }

    /**
     * Creates an ElapsedTime instance with a given start time (in nanoseconds).
     * @param startTime the start time in nanoseconds
     */
    public ElapsedTime(long startTime) {
        resolution = Resolution.SECONDS;
        this.startTime = startTime;
    }

    /**
     * Creates an ElapsedTime instance with the specified resolution.
     * @param resolution SECONDS or MILLISECONDS
     */
    public ElapsedTime(Resolution resolution) {
        this.resolution = resolution;
        reset();
    }

    /**
     * Resets the timer to zero.
     */
    public void reset() {
        startTime = System.nanoTime();
    }

    /**
     * Returns the elapsed time in the units of this timer's resolution.
     * @return elapsed time in seconds or milliseconds depending on resolution
     */
    public double time() {
        return resolution == Resolution.MILLISECONDS ? milliseconds() : seconds();
    }

    /**
     * Returns the elapsed time in seconds.
     * @return elapsed time in seconds
     */
    public double seconds() {
        return (System.nanoTime() - startTime) / (double) SECOND_IN_NANO;
    }

    /**
     * Returns the elapsed time in milliseconds.
     * @return elapsed time in milliseconds
     */
    public double milliseconds() {
        return (System.nanoTime() - startTime) / (double) MILLIS_IN_NANO;
    }

    /**
     * Returns the elapsed time in nanoseconds.
     * @return elapsed time in nanoseconds
     */
    public long nanoseconds() {
        return System.nanoTime() - startTime;
    }

    /**
     * Returns the start time in nanoseconds (as returned by System.nanoTime()).
     * @return start time in nanoseconds
     */
    public double startTime() {
        return startTime;
    }

    /**
     * Returns the resolution of this timer.
     * @return the resolution
     */
    public Resolution getResolution() {
        return resolution;
    }

    @Override
    public String toString() {
        return String.format("%.3f%s", time(), resolution == Resolution.MILLISECONDS ? "ms" : "s");
    }
}
