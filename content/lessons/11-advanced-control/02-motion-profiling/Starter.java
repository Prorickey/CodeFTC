import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Ramped Drive")
public class StudentCode extends LinearOpMode {

    // Maximum power change allowed per loop iteration
    static final double MAX_RAMP = 0.05;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        waitForStart();

        double currentPower = 0.0;

        while (opModeIsActive()) {
            double targetPower = -gamepad1.left_stick_y;

            // TODO: Clamp the change in power to MAX_RAMP per loop.
            //       If (targetPower - currentPower) > MAX_RAMP, only increase by MAX_RAMP.
            //       If (targetPower - currentPower) < -MAX_RAMP, only decrease by MAX_RAMP.
            //       Otherwise, set currentPower = targetPower directly.
            //       Hint: use Math.max and Math.min, or just an if/else chain.


            leftMotor.setPower(currentPower);
            rightMotor.setPower(currentPower);

            telemetry.addData("Target",  targetPower);
            telemetry.addData("Current", currentPower);
            telemetry.update();
        }
    }
}