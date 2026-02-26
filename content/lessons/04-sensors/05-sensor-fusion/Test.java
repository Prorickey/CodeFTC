import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        // Right encoder 100 ticks ahead of left → encoderHeading = 100 / 10.0 = 10.0°
        // IMU yaw = 0.0°
        // fusedHeading = 0.5 * 10.0 + 0.5 * 0.0 = 5.0°
        // error = 0 - 5.0 = -5.0, turnPower = 0.02 * -5.0 = -0.1
        // leftPower = 0.5 + (-0.1) = 0.4, rightPower = 0.5 - (-0.1) = 0.6

        HardwareMap hwMap = new HardwareMap();

        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        leftMotor.setCurrentPosition(0);
        rightMotor.setCurrentPosition(100);   // 100 ticks ahead → 10.0°

        IMUImpl imu = new IMUImpl();
        imu.setYaw(0.0);   // IMU reads no rotation

        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);
        hwMap.registerDevice("imu",        imu);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = new TelemetryImpl();
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("leftMotor ≈ 0.4 (fused heading 5° → correction reduces left)",
                leftMotor.getPower(), 0.4, 0.02);
        TestBase.assertNear("rightMotor ≈ 0.6 (fused heading 5° → correction increases right)",
                rightMotor.getPower(), 0.6, 0.02);

        TestBase.printResults();
    }
}
