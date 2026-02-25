import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        testMotor.setCurrentPosition(200); // encoder at 200, target is 1000 → error = 800
        hwMap.registerDevice("testMotor", testMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // Kp=0.001, error=800 → power = 0.8
        TestBase.assertNear("Motor power ≈ 0.8 (Kp × error = 0.001 × 800)",
                testMotor.getPower(), 0.8, 0.01);

        TestBase.printResults();
    }
}
