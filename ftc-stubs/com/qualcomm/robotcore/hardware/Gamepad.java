package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK Gamepad class.
 * Represents a physical gamepad controller with sticks, buttons, and triggers.
 *
 * <p>All fields are public and mutable, matching the real FTC SDK behavior.
 * For testing, set fields directly before calling the user's code.
 */
public class Gamepad {

    // Analog sticks
    /** Left stick horizontal axis. Range: [-1.0, 1.0], left is negative. */
    public float left_stick_x = 0.0f;

    /** Left stick vertical axis. Range: [-1.0, 1.0], up is negative. */
    public float left_stick_y = 0.0f;

    /** Right stick horizontal axis. Range: [-1.0, 1.0], left is negative. */
    public float right_stick_x = 0.0f;

    /** Right stick vertical axis. Range: [-1.0, 1.0], up is negative. */
    public float right_stick_y = 0.0f;

    // Face buttons
    /** A button (bottom). */
    public boolean a = false;

    /** B button (right). */
    public boolean b = false;

    /** X button (left). */
    public boolean x = false;

    /** Y button (top). */
    public boolean y = false;

    // D-pad
    /** D-pad up. */
    public boolean dpad_up = false;

    /** D-pad down. */
    public boolean dpad_down = false;

    /** D-pad left. */
    public boolean dpad_left = false;

    /** D-pad right. */
    public boolean dpad_right = false;

    // Bumpers
    /** Left bumper. */
    public boolean left_bumper = false;

    /** Right bumper. */
    public boolean right_bumper = false;

    // Triggers
    /** Left trigger. Range: [0.0, 1.0]. */
    public float left_trigger = 0.0f;

    /** Right trigger. Range: [0.0, 1.0]. */
    public float right_trigger = 0.0f;

    // Additional buttons
    /** Left stick button (pressing the stick). */
    public boolean left_stick_button = false;

    /** Right stick button (pressing the stick). */
    public boolean right_stick_button = false;

    /** Guide / home button. */
    public boolean guide = false;

    /** Start button. */
    public boolean start = false;

    /** Back button. */
    public boolean back = false;

    /**
     * Creates a gamepad with all inputs at their default (zero/false) values.
     */
    public Gamepad() {
        // All fields initialized inline to defaults
    }

    /**
     * Resets all gamepad inputs to their default values.
     * Useful between test cases.
     */
    public void reset() {
        left_stick_x = 0.0f;
        left_stick_y = 0.0f;
        right_stick_x = 0.0f;
        right_stick_y = 0.0f;
        a = false;
        b = false;
        x = false;
        y = false;
        dpad_up = false;
        dpad_down = false;
        dpad_left = false;
        dpad_right = false;
        left_bumper = false;
        right_bumper = false;
        left_trigger = 0.0f;
        right_trigger = 0.0f;
        left_stick_button = false;
        right_stick_button = false;
        guide = false;
        start = false;
        back = false;
    }

    @Override
    public String toString() {
        return "Gamepad(" +
            "sticks=[" + left_stick_x + "," + left_stick_y + "," +
            right_stick_x + "," + right_stick_y + "]" +
            " buttons=[a=" + a + ",b=" + b + ",x=" + x + ",y=" + y + "]" +
            " dpad=[u=" + dpad_up + ",d=" + dpad_down +
            ",l=" + dpad_left + ",r=" + dpad_right + "]" +
            " bumpers=[l=" + left_bumper + ",r=" + right_bumper + "]" +
            " triggers=[l=" + left_trigger + ",r=" + right_trigger + "]" +
            ")";
    }
}
