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

        // TODO: Read gamepad1.left_stick_y and gamepad1.right_stick_y
        // TODO: Remember to negate the values (forward on stick = negative value)
        // TODO: Set leftMotor power to the corrected left stick value
        // TODO: Set rightMotor power to the corrected right stick value
    }
}
