import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Tank Drive")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        telemetry.addData("Status", "Initialized");
        telemetry.update();

        waitForStart();

        double leftPower  = -gamepad1.left_stick_y;
        double rightPower = -gamepad1.right_stick_y;

        leftMotor.setPower(leftPower);
        rightMotor.setPower(rightPower);
    }
}
