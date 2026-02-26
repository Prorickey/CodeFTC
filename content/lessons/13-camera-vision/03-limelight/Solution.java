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

        limelight.pipelineSwitch(0);
        limelight.start();

        LLResult result = limelight.getLatestResult();

        if (result != null && result.isValid()) {
            telemetry.addData("TX", result.getTx());
            telemetry.addData("TY", result.getTy());

            for (LLResultTypes.FiducialResult tag : result.getFiducialResults()) {
                telemetry.addData("Tag ID", tag.getFiducialId());
                telemetry.addData("Tag TX", tag.getTargetXDegrees());
            }
        }
        telemetry.update();

        limelight.stop();
    }
}
