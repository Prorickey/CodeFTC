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

        // TODO: Calculate raw motor powers using mecanum inverse kinematics
        //   fl = forward - strafe - rotation
        //   fr = forward + strafe + rotation
        //   bl = forward + strafe - rotation
        //   br = forward - strafe + rotation

        // TODO: Find the maximum absolute value among all four powers
        //   Hint: use Math.max() and Math.abs()

        // TODO: If the maximum exceeds 1.0, divide all four powers by it
        //   This normalizes the powers while preserving their ratios

        // TODO: Set each motor's power
    }
}