import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl frontLeft  = new DcMotorImpl();
        DcMotorImpl frontRight = new DcMotorImpl();
        DcMotorImpl backLeft   = new DcMotorImpl();
        DcMotorImpl backRight  = new DcMotorImpl();
        hwMap.registerDevice("frontLeft",  frontLeft);
        hwMap.registerDevice("frontRight", frontRight);
        hwMap.registerDevice("backLeft",   backLeft);
        hwMap.registerDevice("backRight",  backRight);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        // Pure forward: drive=0.6, strafe=0, rotate=0 → all motors = 0.6
        op.gamepad1.left_stick_y  = -0.6f;
        op.gamepad1.left_stick_x  =  0.0f;
        op.gamepad1.right_stick_x =  0.0f;
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // Direction configuration
        TestBase.assertEqual("frontLeft direction is REVERSE",
                frontLeft.getDirection().toString(), "REVERSE");
        TestBase.assertEqual("backLeft direction is REVERSE",
                backLeft.getDirection().toString(), "REVERSE");
        TestBase.assertEqual("frontRight direction is FORWARD",
                frontRight.getDirection().toString(), "FORWARD");

        // BRAKE behavior
        TestBase.assertEqual("frontLeft uses BRAKE",
                frontLeft.getZeroPowerBehavior().toString(), "BRAKE");
        TestBase.assertEqual("frontRight uses BRAKE",
                frontRight.getZeroPowerBehavior().toString(), "BRAKE");

        // Motor powers (all should be 0.6 for pure forward)
        TestBase.assertNear("frontLeft power ≈ 0.6", frontLeft.getPower(), 0.6, 0.05);
        TestBase.assertNear("frontRight power ≈ 0.6", frontRight.getPower(), 0.6, 0.05);

        TestBase.printResults();
    }
}
