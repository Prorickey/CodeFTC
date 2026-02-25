import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DigitalChannel;

@TeleOp(name = "Touch Sensor")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        // TODO: Get the DigitalChannel named "limitSwitch" from hardwareMap
        // TODO: Set the digital channel mode to INPUT
        
        DcMotor liftMotor = hardwareMap.get(DcMotor.class, "liftMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Read the limit switch state using getState()
        //       Remember: getState() returns FALSE when pressed!
        
        // TODO: If the switch is pressed, set liftMotor power to 0.0
        // TODO: If the switch is NOT pressed, set liftMotor power to 0.5
    }
}