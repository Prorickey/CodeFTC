package com.qualcomm.robotcore.hardware;

/**
 * Stub implementation of WebcamName for use in sandbox tests.
 */
public class WebcamNameImpl implements WebcamName {
    private boolean attached;

    public WebcamNameImpl() {
        this.attached = true;
    }

    public WebcamNameImpl(boolean attached) {
        this.attached = attached;
    }

    @Override public boolean isAttached()   { return attached; }
    @Override public String  getDeviceName() { return "Webcam"; }
    @Override public String  getManufacturer() { return "Unknown"; }
    @Override public void    close() {}
}
