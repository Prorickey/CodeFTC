import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Drivetrain Setup")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor frontLeft  = hardwareMap.get(DcMotor.class, "frontLeft");
        DcMotor frontRight = hardwareMap.get(DcMotor.class, "frontRight");
        DcMotor backLeft   = hardwareMap.get(DcMotor.class, "backLeft");
        DcMotor backRight  = hardwareMap.get(DcMotor.class, "backRight");

        // TODO: Reverse the left-side motors (frontLeft, backLeft)
        //       so all four motors push the robot in the same direction

        // TODO: Set all four motors to BRAKE zero power behavior

        waitForStart();

        while (opModeIsActive()) {
            double drive  = -gamepad1.left_stick_y;
            double strafe =  gamepad1.left_stick_x;
            double rotate =  gamepad1.right_stick_x;

            // TODO: Set motor powers using mecanum equations:
            //   frontLeft  = drive + strafe + rotate
            //   frontRight = drive - strafe - rotate
            //   backLeft   = drive - strafe + rotate
            //   backRight  = drive + strafe - rotate
        }
    }
}