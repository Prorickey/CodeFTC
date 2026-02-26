import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        // IMU reads 6.0° (noisy)
        // KalmanFilter: x0=0, p0=1.0, q=0.1, r=1.0
        // Predict: p = 1.0 + 0.1 = 1.1
        // k = 1.1 / (1.1 + 1.0) = 1.1 / 2.1 ≈ 0.52381
        // x = 0 + 0.52381 * (6.0 - 0) ≈ 3.1429°
        // p = (1 - 0.52381) * 1.1 ≈ 0.5238
        // error = 0 - 3.1429 = -3.1429
        // turnPower = 0.02 * -3.1429 ≈ -0.06286
        // leftPower  = 0.5 + (-0.06286) ≈ 0.437
        // rightPower = 0.5 - (-0.06286) ≈ 0.563

        final double RAW_HEADING      = 6.0;
        final double p_after_predict  = 1.0 + 0.1;
        final double k                = p_after_predict / (p_after_predict + 1.0);
        final double filteredHeading  = 0.0 + k * (RAW_HEADING - 0.0);
        final double expectedLeft     = 0.5 + 0.02 * (0.0 - filteredHeading);
        final double expectedRight    = 0.5 - 0.02 * (0.0 - filteredHeading);

        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        IMUImpl imu = new IMUImpl();
        imu.setYaw(RAW_HEADING);

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

        TestBase.assertNear("leftMotor power matches Kalman-filtered heading hold",
                leftMotor.getPower(), expectedLeft, 0.005);
        TestBase.assertNear("rightMotor power matches Kalman-filtered heading hold",
                rightMotor.getPower(), expectedRight, 0.005);

        TestBase.printResults();
    }
}
