package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK RevHubOrientationOnRobot class.
 * Describes the orientation of the REV Control Hub on the robot.
 */
public class RevHubOrientationOnRobot {

    public enum LogoFacingDirection { UP, DOWN, FORWARD, BACKWARD, LEFT, RIGHT }
    public enum UsbFacingDirection { UP, DOWN, FORWARD, BACKWARD, LEFT, RIGHT }

    /**
     * Creates a RevHubOrientationOnRobot with the specified logo and USB port directions.
     * @param logo the direction the REV logo is facing
     * @param usb the direction the USB port is facing
     */
    public RevHubOrientationOnRobot(LogoFacingDirection logo, UsbFacingDirection usb) {
        // Stub — no-op
    }
}
