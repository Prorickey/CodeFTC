package com.qualcomm.robotcore.hardware;

/**
 * Stub for the FTC SDK DcMotor interface.
 * Extends DcMotorSimple with encoder-related functionality.
 */
public interface DcMotor extends DcMotorSimple {

    enum RunMode {
        RUN_WITHOUT_ENCODER,
        RUN_USING_ENCODER,
        RUN_TO_POSITION,
        STOP_AND_RESET_ENCODER
    }

    enum ZeroPowerBehavior {
        UNKNOWN,
        BRAKE,
        FLOAT
    }

    // Direction is inherited from DcMotorSimple

    void setZeroPowerBehavior(ZeroPowerBehavior behavior);
    ZeroPowerBehavior getZeroPowerBehavior();

    void setMode(RunMode mode);
    RunMode getMode();
    int getCurrentPosition();
    void setTargetPosition(int position);
    int getTargetPosition();
    boolean isBusy();
}
