import com.qualcomm.hardware.limelightvision.*;
import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        // Build the pre-seeded Limelight result
        LLResult result = new LLResult(true, -4.5, 2.1, 3.7, 5L);
        result.addFiducialResult(new LLResultTypes.FiducialResult(2, -4.5, 2.1, 3.7));

        // Build the Limelight stub and seed the result
        Limelight3A limelight = new Limelight3A();
        limelight.setLatestResult(result);
        // Note: setLatestResult only returns data when running=true (after start()),
        // so we set it here; the stub will return it once start() is called.
        // Pre-set it so that after start() it is available.

        HardwareMap hwMap = new HardwareMap();
        hwMap.registerDevice("limelight", limelight);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = telemetry;
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertContains("Telemetry shows TX value (-4.5)",
                log, "-4.5");
        TestBase.assertContains("Telemetry shows TY value (2.1)",
                log, "2.1");
        TestBase.assertContains("Telemetry shows fiducial tag ID 2",
                log, "2");
        TestBase.assertTrue("Limelight was stopped after use",
                !limelight.isRunning(),
                "Expected limelight.stop() to be called, but isRunning() is still true");

        TestBase.printResults();
    }
}
