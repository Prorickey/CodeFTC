import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.Servo;

@TeleOp(name = "Toggle Servo")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get a Servo from hardwareMap named "clawServo"
        
        waitForStart();
        
        // TODO: Create a boolean variable clawOpen, initially false
        
        // TODO: If gamepad1.a is pressed, set clawOpen to true
        
        // TODO: If clawOpen is true, set servo position to 1.0
        //       Otherwise, set servo position to 0.0
    }
}