import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        IMUImpl imu = new IMUImpl();
        imu.setYaw(5.0); // 5° off from target of 0° → correction = Kp * (0 - 5) = 0.02 * -5 = -0.1
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);
        hwMap.registerDevice("imu", imu);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // drivePower=0.5, correction=-0.1
        // leftMotor  = drivePower + correction = 0.5 - 0.1 = 0.4
        // rightMotor = drivePower - correction = 0.5 + 0.1 = 0.6
        TestBase.assertNear("Left motor ≈ 0.4 (reduced to correct rightward drift)",
                leftMotor.getPower(), 0.4, 0.02);
        TestBase.assertNear("Right motor ≈ 0.6 (increased to correct rightward drift)",
                rightMotor.getPower(), 0.6, 0.02);

        TestBase.printResults();
    }
}
