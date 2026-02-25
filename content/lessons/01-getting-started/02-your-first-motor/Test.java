import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        hwMap.registerDevice("testMotor", testMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> calls = op.getCallLog();

        TestBase.assertTrue("waitForStart() is called",
                calls.stream().anyMatch(c -> c.contains("waitForStart")),
                "waitForStart() was never called");
        TestBase.assertNear("Motor power is 0.5", testMotor.getPower(), 0.5, 0.01);

        TestBase.printResults();
    }
}
