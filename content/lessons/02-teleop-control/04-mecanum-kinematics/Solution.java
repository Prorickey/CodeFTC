import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Mecanum Drive")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor frontLeft  = hardwareMap.get(DcMotor.class, "frontLeft");
        DcMotor frontRight = hardwareMap.get(DcMotor.class, "frontRight");
        DcMotor backLeft   = hardwareMap.get(DcMotor.class, "backLeft");
        DcMotor backRight  = hardwareMap.get(DcMotor.class, "backRight");

        waitForStart();

        // Read gamepad inputs
        double forward  = -gamepad1.left_stick_y;  // Forward (negate Y)
        double strafe   =  gamepad1.left_stick_x;  // Strafe right
        double rotation =  gamepad1.right_stick_x; // Rotate clockwise

        // Calculate raw motor powers using mecanum inverse kinematics
        double fl = forward - strafe - rotation;
        double fr = forward + strafe + rotation;
        double bl = forward + strafe - rotation;
        double br = forward - strafe + rotation;

        // Find the maximum absolute value among all four powers
        double max = Math.max(Math.abs(fl), Math.max(Math.abs(fr),
                     Math.max(Math.abs(bl), Math.abs(br))));

        // If the maximum exceeds 1.0, divide all four powers by it
        if (max > 1.0) {
            fl /= max;
            fr /= max;
            bl /= max;
            br /= max;
        }

        // Set each motor's power
        frontLeft.setPower(fl);
        frontRight.setPower(fr);
        backLeft.setPower(bl);
        backRight.setPower(br);
    }
}