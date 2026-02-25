import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "First Motor")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get a DcMotor from hardwareMap named "testMotor"
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Set the motor power to 0.5
        
        telemetry.addData("Status", "Running");
        telemetry.update();
    }
}