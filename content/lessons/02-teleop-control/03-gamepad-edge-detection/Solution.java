import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.Servo;

@TeleOp(name = "Toggle Servo")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        Servo clawServo = hardwareMap.get(Servo.class, "clawServo");
        
        waitForStart();
        
        boolean clawOpen = false;
        
        if (gamepad1.a) {
            clawOpen = !clawOpen;
        }
        
        if (clawOpen) {
            clawServo.setPosition(1.0);
        } else {
            clawServo.setPosition(0.0);
        }
    }
}