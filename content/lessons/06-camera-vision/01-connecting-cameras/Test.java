import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        hwMap.registerDevice("Webcam 1", new WebcamNameImpl());

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = telemetry;
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertContains("Telemetry shows \"State\" caption",
                log, "State");
        TestBase.assertContains("Portal state is RUNNING",
                log, "RUNNING");
        TestBase.assertContains("Telemetry shows \"Detections\" caption",
                log, "Detections");

        TestBase.printResults();
    }
}
