import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        testMotor.setCurrentPosition(300); // encoder at 300, target 1000 → error = 700
        hwMap.registerDevice("testMotor", testMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // Kp=0.001, error=700 → P term=0.7
        // On first iteration, I and D terms are 0 → power ≈ 0.7
        TestBase.assertNear("Motor power ≈ 0.7 (P term only on first loop iteration)",
                testMotor.getPower(), 0.7, 0.05);

        TestBase.printResults();
    }
}
