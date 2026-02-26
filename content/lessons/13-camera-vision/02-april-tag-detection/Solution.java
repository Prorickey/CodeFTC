import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.WebcamName;
import org.firstinspires.ftc.vision.VisionPortal;
import org.firstinspires.ftc.vision.apriltag.AprilTagDetection;
import org.firstinspires.ftc.vision.apriltag.AprilTagProcessor;
import java.util.List;

@Autonomous(name = "AprilTag Detection")
public class StudentCode extends LinearOpMode {

    // Public so the test harness can pre-seed detections before runOpMode()
    public AprilTagProcessor aprilTag = new AprilTagProcessor.Builder().build();

    @Override
    public void runOpMode() {
        VisionPortal portal = new VisionPortal.Builder()
                .setCamera(hardwareMap.get(WebcamName.class, "Webcam 1"))
                .addProcessor(aprilTag)
                .build();

        waitForStart();

        List<AprilTagDetection> detections = aprilTag.getDetections();

        for (AprilTagDetection detection : detections) {
            telemetry.addData("Tag ID",        detection.id);
            telemetry.addData("Range (in)",    "%.1f", detection.ftcPose.range);
            telemetry.addData("Bearing (deg)", "%.1f", detection.ftcPose.bearing);
        }
        telemetry.update();

        portal.close();
    }
}
