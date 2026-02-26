import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.Servo;

@TeleOp(name = "Servo Control")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get a Servo from hardwareMap named "testServo"
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: If gamepad1.a is pressed, set servo position to 1.0
        // TODO: If gamepad1.b is pressed, set servo position to 0.0
    }
}