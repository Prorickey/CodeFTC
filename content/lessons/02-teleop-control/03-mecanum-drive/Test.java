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
        // Pure forward: left_stick_y = -0.5, no strafe or rotation
        op.gamepad1.left_stick_y  = -0.5f;
        op.gamepad1.left_stick_x  =  0.0f;
        op.gamepad1.right_stick_x =  0.0f;
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // Pure forward → all four wheels same power (0.5), no normalization needed
        TestBase.assertNear("Front-left motor = 0.5",  frontLeft.getPower(),  0.5, 0.05);
        TestBase.assertNear("Front-right motor = 0.5", frontRight.getPower(), 0.5, 0.05);
        TestBase.assertNear("Back-left motor = 0.5",   backLeft.getPower(),   0.5, 0.05);
        TestBase.assertNear("Back-right motor = 0.5",  backRight.getPower(),  0.5, 0.05);

        TestBase.printResults();
    }
}
