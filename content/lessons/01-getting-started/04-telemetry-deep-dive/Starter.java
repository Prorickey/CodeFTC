import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Telemetry Dashboard")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get a DcMotor from hardwareMap named "testMotor"
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Read gamepad1.left_stick_y and negate it
        // TODO: Set the motor power to the negated value
        
        // TODO: Add telemetry data with caption "Motor Power" showing the power
        // TODO: Add telemetry data with caption "Status" and value "Running"
        // TODO: Call telemetry.update()
    }
}