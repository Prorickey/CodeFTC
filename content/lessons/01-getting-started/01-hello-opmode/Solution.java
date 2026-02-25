import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;

@TeleOp(name = "Hello OpMode")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        telemetry.addData("Message", "Hello, FTC!");
        telemetry.update();
        
        waitForStart();
        
        telemetry.addData("Status", "Running");
        telemetry.update();
    }
}