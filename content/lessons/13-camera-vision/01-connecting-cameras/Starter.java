import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.WebcamName;
import org.firstinspires.ftc.vision.VisionPortal;
import org.firstinspires.ftc.vision.apriltag.AprilTagProcessor;

@Autonomous(name = "Camera Setup")
public class StudentCode extends LinearOpMode {

    @Override
    public void runOpMode() {
        // TODO: Create an AprilTagProcessor using AprilTagProcessor.Builder
        //       (call .build() at the end)

        // TODO: Create a VisionPortal using VisionPortal.Builder
        //       - setCamera(hardwareMap.get(WebcamName.class, "Webcam 1"))
        //       - addProcessor(aprilTag)
        //       - build()

        waitForStart();

        // TODO: Display telemetry:
        //   telemetry.addData("State", portal.getPortalState());
        //   telemetry.addData("Detections", aprilTag.getDetectionCount());
        //   telemetry.update();
    }
}
