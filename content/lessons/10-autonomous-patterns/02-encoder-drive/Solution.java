import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;

@Autonomous(name = "Encoder Drive")
public class StudentCode extends LinearOpMode {

    static final double TICKS_PER_REV      = 537.7;
    static final double WHEEL_DIAMETER_CM  = 10.0;
    static final double TARGET_CM          = 60.0;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        leftMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        rightMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);

        double circumference = Math.PI * WHEEL_DIAMETER_CM;
        int targetTicks = (int)(TARGET_CM / circumference * TICKS_PER_REV);

        leftMotor.setTargetPosition(targetTicks);
        rightMotor.setTargetPosition(targetTicks);

        leftMotor.setMode(DcMotor.RunMode.RUN_TO_POSITION);
        rightMotor.setMode(DcMotor.RunMode.RUN_TO_POSITION);

        waitForStart();

        leftMotor.setPower(0.5);
        rightMotor.setPower(0.5);

        while (opModeIsActive() && (leftMotor.isBusy() || rightMotor.isBusy())) {
            telemetry.addData("Left ticks",  leftMotor.getCurrentPosition());
            telemetry.addData("Right ticks", rightMotor.getCurrentPosition());
            telemetry.update();
        }

        leftMotor.setPower(0.0);
        rightMotor.setPower(0.0);
    }
}