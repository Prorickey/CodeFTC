package com.qualcomm.robotcore.hardware;

/**
 * Mock implementation of DcMotorEx that extends DcMotorImpl with velocity control.
 *
 * <p>Usage in tests:
 * <pre>
 *   DcMotorExImpl motor = new DcMotorExImpl();
 *   motor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
 *   motor.setVelocity(500);
 *   assert motor.getVelocity() == 500;
 * </pre>
 */
public class DcMotorExImpl extends DcMotorImpl implements DcMotorEx {

    private double velocity = 0.0;
    private boolean motorEnabled = true;

    public DcMotorExImpl() {
        super();
    }

    @Override
    public void setVelocity(double ticksPerSecond) {
        callLog.add("setVelocity(" + ticksPerSecond + ")");
        this.velocity = ticksPerSecond;
    }

    @Override
    public double getVelocity() {
        callLog.add("getVelocity()");
        return velocity;
    }

    @Override
    public void setMotorEnable() {
        callLog.add("setMotorEnable()");
        this.motorEnabled = true;
    }

    @Override
    public void setMotorDisable() {
        callLog.add("setMotorDisable()");
        this.motorEnabled = false;
    }

    @Override
    public boolean isMotorEnabled() {
        callLog.add("isMotorEnabled()");
        return motorEnabled;
    }
}
