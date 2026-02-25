import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.Servo;

@TeleOp(name = "Servo Control")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        Servo testServo = hardwareMap.get(Servo.class, "testServo");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        if (gamepad1.a) {
            testServo.setPosition(1.0);
        }
        if (gamepad1.b) {
            testServo.setPosition(0.0);
        }
    }
}