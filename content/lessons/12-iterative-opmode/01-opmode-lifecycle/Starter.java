import com.qualcomm.robotcore.eventloop.opmode.OpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "My Iterative OpMode")
public class StudentCode extends OpMode {

    DcMotor driveMotor;

    @Override
    public void init() {
        // TODO: Get driveMotor from hardwareMap using DcMotor.class and name "driveMotor"

        telemetry.addData("Status", "Initialized");
        telemetry.update();
    }

    @Override
    public void loop() {
        // TODO: Set driveMotor power to -gamepad1.left_stick_y
        //       (negate Y because up on the stick is -1.0 in FTC)

        telemetry.addData("Power", driveMotor.getPower());
        telemetry.update();
    }
}