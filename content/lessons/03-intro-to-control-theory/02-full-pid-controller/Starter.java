import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "PID Controller")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor testMotor = hardwareMap.get(DcMotor.class, "testMotor");
        
        int targetPosition = 1000;
        double Kp = 0.001;
        
        telemetry.addData("Status", "Initialized");
        telemetry.addData("Target", targetPosition);
        telemetry.update();
        
        waitForStart();
        
        // TODO: Get the current position from the motor encoder
        //       Hint: use testMotor.getCurrentPosition()
        
        // TODO: Calculate the error (target - current position)
        
        // TODO: Calculate the P term (Kp * error)
        
        // TODO: Set the motor power to the P term
        //       In a full PID, this would be pTerm + iTerm + dTerm
        
        telemetry.addData("Target", targetPosition);
        telemetry.addData("Current", "your current position variable here");
        telemetry.addData("Error", "your error variable here");
        telemetry.addData("Power", "your power variable here");
        telemetry.update();
    }
}