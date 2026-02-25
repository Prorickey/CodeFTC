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
        // forward=0.6, strafe=0.4, rotation=0.3
        // fl=-0.1, fr=1.3, bl=0.7, br=0.5 → normalize by 1.3
        op.gamepad1.left_stick_y  = -0.6f;
        op.gamepad1.left_stick_x  =  0.4f;
        op.gamepad1.right_stick_x =  0.3f;
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Front-right ≈ 1.0 (raw 1.3, normalized to max)",
                frontRight.getPower(), 1.0, 0.05);
        TestBase.assertNear("Front-left ≈ -0.077 (raw -0.1 / 1.3)",
                frontLeft.getPower(), -0.077, 0.05);
        TestBase.assertNear("Back-left ≈ 0.538 (raw 0.7 / 1.3)",
                backLeft.getPower(), 0.538, 0.05);
        TestBase.assertNear("Back-right ≈ 0.385 (raw 0.5 / 1.3)",
                backRight.getPower(), 0.385, 0.05);

        TestBase.printResults();
    }
}
