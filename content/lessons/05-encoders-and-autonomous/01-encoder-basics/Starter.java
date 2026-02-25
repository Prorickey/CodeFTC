import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Encoder Basics")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Read the current encoder position
        //       Use driveMotor.getCurrentPosition()
        
        // TODO: Display the position on telemetry
        //       Caption should be "Position"
        //       Don't forget telemetry.update()!
    }
}