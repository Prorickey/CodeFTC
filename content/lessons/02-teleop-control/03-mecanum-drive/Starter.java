import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Mecanum Drive")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get four DcMotors from hardwareMap:
        //       "frontLeft", "backLeft", "frontRight", "backRight"
        
        waitForStart();
        
        // TODO: Calculate the three movement components:
        //       y  = -gamepad1.left_stick_y  (forward/back)
        //       x  = gamepad1.left_stick_x * 1.1  (strafe with correction)
        //       rx = gamepad1.right_stick_x  (rotation)
        
        // TODO: Calculate the denominator for normalization:
        //       denominator = Math.max(Math.abs(y) + Math.abs(x) + Math.abs(rx), 1)
        
        // TODO: Set motor powers using the mecanum formula:
        //       frontLeft  = (y + x + rx) / denominator
        //       backLeft   = (y - x + rx) / denominator
        //       frontRight = (y - x - rx) / denominator
        //       backRight  = (y + x - rx) / denominator
    }
}