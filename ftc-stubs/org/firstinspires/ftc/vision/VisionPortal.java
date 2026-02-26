package org.firstinspires.ftc.vision;

import com.qualcomm.robotcore.hardware.WebcamName;

/**
 * Stub for the FTC SDK VisionPortal.
 * Manages a camera stream and routes frames to one or more vision processors.
 *
 * <p>Typical usage:
 * <pre>
 *   AprilTagProcessor aprilTag = new AprilTagProcessor.Builder().build();
 *
 *   VisionPortal portal = new VisionPortal.Builder()
 *       .setCamera(hardwareMap.get(WebcamName.class, "Webcam 1"))
 *       .addProcessor(aprilTag)
 *       .build();
 * </pre>
 */
public class VisionPortal {

    /** Represents the operational state of the portal. */
    public enum PortalState {
        /** Portal is actively streaming and processing frames. */
        RUNNING,
        /** Portal has been stopped but can be restarted. */
        STOPPED,
        /** Portal has been closed and cannot be restarted. */
        CAMERA_DEVICE_CLOSED,
        /** Portal encountered an error. */
        ERROR
    }

    private PortalState state = PortalState.RUNNING;
    private boolean built = false;

    private VisionPortal() {
        this.built = true;
    }

    /** Returns the current state of the camera portal. */
    public PortalState getPortalState() {
        return state;
    }

    /** Returns true if the portal is actively streaming. */
    public boolean isStreaming() {
        return state == PortalState.RUNNING;
    }

    /** Stops the camera stream to save resources. Can be restarted with resumeStreaming(). */
    public void stopStreaming() {
        state = PortalState.STOPPED;
    }

    /** Resumes streaming after stopStreaming(). */
    public void resumeStreaming() {
        state = PortalState.RUNNING;
    }

    /** Permanently closes the portal and releases camera resources. */
    public void close() {
        state = PortalState.CAMERA_DEVICE_CLOSED;
    }

    /** Returns true if the portal was successfully built. */
    public boolean isBuilt() {
        return built;
    }

    /** Builder for VisionPortal. */
    public static class Builder {
        private WebcamName camera = null;
        private boolean autoStartStreaming = true;
        private int[] resolution = {640, 480};

        /**
         * Sets the camera to use (a USB webcam).
         * @param cameraName WebcamName from hardwareMap
         */
        public Builder setCamera(WebcamName cameraName) {
            this.camera = cameraName;
            return this;
        }

        /**
         * Adds a vision processor to receive camera frames.
         * @param processor any vision processor (e.g. AprilTagProcessor)
         */
        public Builder addProcessor(Object processor) {
            // Stub — processors are stored by the user and queried directly
            return this;
        }

        /** Sets whether streaming starts automatically on build(). Default true. */
        public Builder setAutoStartStreaming(boolean autoStart) {
            this.autoStartStreaming = autoStart;
            return this;
        }

        /** Sets the camera resolution. */
        public Builder setCameraResolution(int widthPx, int heightPx) {
            this.resolution = new int[]{widthPx, heightPx};
            return this;
        }

        /**
         * Builds and returns a live VisionPortal.
         * @throws IllegalStateException if no camera was set
         */
        public VisionPortal build() {
            if (camera == null) {
                throw new IllegalStateException(
                    "VisionPortal.Builder: must call setCamera() before build()");
            }
            VisionPortal portal = new VisionPortal();
            if (!autoStartStreaming) {
                portal.state = PortalState.STOPPED;
            }
            return portal;
        }
    }
}
