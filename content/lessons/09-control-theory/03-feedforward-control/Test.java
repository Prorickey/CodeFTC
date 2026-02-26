import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl armMotor = new DcMotorImpl();
        armMotor.setCurrentPosition(200); // target=500, error=300, Kp=0.001 → P=0.3, kG=0.1 → total=0.4
        hwMap.registerDevice("armMotor", armMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // P = 0.001 * 300 = 0.3, kG = 0.1 → total ≈ 0.4
        TestBase.assertNear("Motor power ≈ 0.4 (P term 0.3 + gravity feedforward 0.1)",
                armMotor.getPower(), 0.4, 0.02);

        TestBase.printResults();
    }
}
