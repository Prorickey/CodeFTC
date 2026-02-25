import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        CRServoImpl intake = new CRServoImpl();
        hwMap.registerDevice("intake", intake);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.gamepad1.right_trigger = 0.8f;
        op.gamepad1.left_trigger  = 0.0f;
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // right_trigger - left_trigger = 0.8 - 0.0 = 0.8
        TestBase.assertNear("Intake power = 0.8 (right_trigger - left_trigger)",
                intake.getPower(), 0.8, 0.01);

        TestBase.printResults();
    }
}
