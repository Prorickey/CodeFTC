import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        IMUImpl imu = new IMUImpl();
        // Robot is at 80° — error = 90 - 80 = 10, correction = 0.02 * 10 = 0.2
        imu.setYaw(80.0);
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);
        hwMap.registerDevice("imu", imu);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // error = 90 - 80 = 10, correction = 0.02 * 10 = 0.2
        TestBase.assertNear("Left motor power ≈ 0.2 (Kp × error = 0.02 × 10)",
                leftMotor.getPower(), 0.2, 0.02);
        TestBase.assertNear("Right motor power ≈ -0.2 (opposite of left for turning)",
                rightMotor.getPower(), -0.2, 0.02);

        TestBase.printResults();
    }
}
