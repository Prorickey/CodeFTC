import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Run to Position")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        
        // TODO: Step 1 - Reset the encoder
        //       driveMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        
        // TODO: Step 2 - Set the target position to 1000 ticks
        //       driveMotor.setTargetPosition(1000);
        
        // TODO: Step 3 - Set the run mode to RUN_TO_POSITION
        //       driveMotor.setMode(DcMotor.RunMode.RUN_TO_POSITION);
        
        telemetry.addData("Status", "Ready to move to 1000 ticks");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Step 4 - Set the motor power to 0.5 to begin moving
    }
}