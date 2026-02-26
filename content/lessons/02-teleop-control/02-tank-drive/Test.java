import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        hwMap.registerDevice("leftMotor", leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        // Sticks pushed forward (negative Y = forward on physical controller)
        op.gamepad1.left_stick_y  = -0.8f;
        op.gamepad1.right_stick_y = -0.6f;
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Left motor power is 0.8", leftMotor.getPower(), 0.8, 0.01);
        TestBase.assertNear("Right motor power is 0.6", rightMotor.getPower(), 0.6, 0.01);

        TestBase.printResults();
    }
}
