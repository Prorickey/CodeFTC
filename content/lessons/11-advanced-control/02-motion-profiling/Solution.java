import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Ramped Drive")
public class StudentCode extends LinearOpMode {

    static final double MAX_RAMP = 0.05;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        waitForStart();

        double currentPower = 0.0;

        while (opModeIsActive()) {
            double targetPower = -gamepad1.left_stick_y;

            double delta = targetPower - currentPower;
            if (delta > MAX_RAMP) {
                currentPower += MAX_RAMP;
            } else if (delta < -MAX_RAMP) {
                currentPower -= MAX_RAMP;
            } else {
                currentPower = targetPower;
            }

            leftMotor.setPower(currentPower);
            rightMotor.setPower(currentPower);

            telemetry.addData("Target",  targetPower);
            telemetry.addData("Current", currentPower);
            telemetry.update();
        }
    }
}