import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.WebcamName;
import org.firstinspires.ftc.vision.VisionPortal;
import org.firstinspires.ftc.vision.apriltag.AprilTagProcessor;

@Autonomous(name = "Camera Setup")
public class StudentCode extends LinearOpMode {

    @Override
    public void runOpMode() {
        AprilTagProcessor aprilTag = new AprilTagProcessor.Builder()
                .setDrawTagOutline(true)
                .build();

        VisionPortal portal = new VisionPortal.Builder()
                .setCamera(hardwareMap.get(WebcamName.class, "Webcam 1"))
                .addProcessor(aprilTag)
                .setCameraResolution(640, 480)
                .build();

        waitForStart();

        telemetry.addData("State", portal.getPortalState());
        telemetry.addData("Detections", aprilTag.getDetectionCount());
        telemetry.update();
    }
}
