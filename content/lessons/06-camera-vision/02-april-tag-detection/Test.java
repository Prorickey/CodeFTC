import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import org.firstinspires.ftc.vision.apriltag.*;
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

        // Pre-seed two detections into the student's processor field
        // before runOpMode() is called, so getDetections() returns them.
        op.aprilTag.addDetection(new AprilTagDetection(
                3, 95.0f,
                new AprilTagPoseFtc(0, 24.0, 0, 0, 0, 0, 24.0, -5.0, 0)));
        op.aprilTag.addDetection(new AprilTagDetection(
                7, 80.0f,
                new AprilTagPoseFtc(0, 36.5, 0, 0, 0, 0, 36.5, 12.0, 0)));

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertContains("Telemetry shows tag ID 3",              log, "Tag ID: 3");
        TestBase.assertContains("Telemetry shows tag ID 7",              log, "Tag ID: 7");
        TestBase.assertContains("Telemetry shows range for tag 3 (24.0 in)", log, "24.0");
        TestBase.assertContains("Telemetry shows range for tag 7 (36.5 in)", log, "36.5");

        TestBase.printResults();
    }
}
