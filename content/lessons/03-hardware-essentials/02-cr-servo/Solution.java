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
            intake.setPower(gamepad1.right_trigger - gamepad1.left_trigger);

            telemetry.addData("Intake power", intake.getPower());
            telemetry.update();
        }
    }
}