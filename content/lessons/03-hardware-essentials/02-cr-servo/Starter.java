import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.CRServo;

@TeleOp(name = "Intake Control")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        CRServo intake = hardwareMap.get(CRServo.class, "intake");

        waitForStart();

        while (opModeIsActive()) {
            // TODO: Set intake power to (right_trigger - left_trigger)
            //       right_trigger intakes (positive power)
            //       left_trigger  reverses / ejects (negative power)
            //       When both are released: power = 0, intake stops

            telemetry.addData("Intake power", intake.getPower());
            telemetry.update();
        }
    }
}