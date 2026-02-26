import com.qualcomm.robotcore.eventloop.opmode.OpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "My Iterative OpMode")
public class StudentCode extends OpMode {

    DcMotor driveMotor;

    @Override
    public void init() {
        driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");

        telemetry.addData("Status", "Initialized");
        telemetry.update();
    }

    @Override
    public void loop() {
        driveMotor.setPower(-gamepad1.left_stick_y);

        telemetry.addData("Power", driveMotor.getPower());
        telemetry.update();
    }
}