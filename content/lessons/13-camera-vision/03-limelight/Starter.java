import com.qualcomm.hardware.limelightvision.LLResult;
import com.qualcomm.hardware.limelightvision.LLResultTypes;
import com.qualcomm.hardware.limelightvision.Limelight3A;
import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;

@Autonomous(name = "Limelight Demo")
public class StudentCode extends LinearOpMode {

    @Override
    public void runOpMode() {
        Limelight3A limelight = hardwareMap.get(Limelight3A.class, "limelight");

        waitForStart();

        // TODO: Switch to pipeline 0 and start the Limelight
        //   limelight.pipelineSwitch(0);
        //   limelight.start();

        // TODO: Get the latest result
        //   LLResult result = limelight.getLatestResult();

        // TODO: If result is not null and isValid():
        //   telemetry.addData("TX", result.getTx());
        //   telemetry.addData("TY", result.getTy());

        // TODO: Loop through result.getFiducialResults() and for each tag:
        //   telemetry.addData("Tag ID", tag.getFiducialId());
        //   telemetry.addData("Tag TX", tag.getTargetXDegrees());

        // TODO: telemetry.update();

        // TODO: limelight.stop();
    }
}
