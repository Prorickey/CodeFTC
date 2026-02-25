package com.qualcomm.robotcore.hardware;

import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

/**
 * Stub for the FTC SDK IMU interface.
 * Provides access to the inertial measurement unit on the REV Control Hub.
 */
public interface IMU {

    /**
     * Initializes the IMU with the given parameters.
     * @param parameters the initialization parameters
     */
    void initialize(Parameters parameters);

    /**
     * Resets the yaw angle to zero.
     */
    void resetYaw();

    /**
     * Returns the current yaw, pitch, and roll angles.
     * @return the current orientation angles
     */
    YawPitchRollAngles getRobotYawPitchRollAngles();

    /**
     * Parameters for initializing the IMU.
     */
    class Parameters {
        /**
         * Creates IMU parameters with the specified hub orientation.
         * @param orientationOnRobot the orientation of the REV Hub on the robot
         */
        public Parameters(RevHubOrientationOnRobot orientationOnRobot) {
            // Stub — no-op
        }
    }
}
