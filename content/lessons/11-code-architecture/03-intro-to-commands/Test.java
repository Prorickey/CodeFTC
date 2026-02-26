import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl driveMotor = new DcMotorImpl();
        hwMap.registerDevice("driveMotor", driveMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // After scheduler.schedule(), initialize() sets power to 0.75.
        // After scheduler.run(), execute() runs (no-op), isFinished() returns true,
        // end(false) sets power back to 0.0.
        TestBase.assertNear("Motor power is 0.0 after command ends",
                driveMotor.getPower(), 0.0, 0.01);

        TestBase.assertTrue("initialize() called setPower(0.75) on the motor",
                driveMotor.getCallLog().contains("setPower(0.75)"),
                "Expected setPower(0.75) in call log but it was missing");

        TestBase.assertTrue("end() called setPower(0.0) to stop the motor",
                driveMotor.getCallLog().contains("setPower(0.0)"),
                "Expected setPower(0.0) in call log but it was missing");

        TestBase.printResults();
    }
}
