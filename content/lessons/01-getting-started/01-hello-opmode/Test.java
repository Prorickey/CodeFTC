import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = new HardwareMap();
        op.telemetry = telemetry;
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();
        List<String> calls = op.getCallLog();

        TestBase.assertTrue("waitForStart() is called",
                calls.stream().anyMatch(c -> c.contains("waitForStart")),
                "waitForStart() was never called");
        TestBase.assertContains("Telemetry shows \"Hello, FTC!\"", log, "Hello, FTC!");
        TestBase.assertContains("Telemetry shows \"Running\"", log, "Running");

        TestBase.printResults();
    }
}
