import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Feedforward Control")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor armMotor = hardwareMap.get(DcMotor.class, "armMotor");
        
        int targetPosition = 500;
        double Kp = 0.001;
        double kG = 0.1;  // Gravity feedforward constant
        
        telemetry.addData("Status", "Initialized");
        telemetry.addData("Target", targetPosition);
        telemetry.update();
        
        waitForStart();
        
        // TODO: Get the current position from the motor encoder
        
        // TODO: Calculate the error (target - current position)
        
        // TODO: Calculate the P term (Kp * error)
        
        // TODO: Calculate total power by adding the P term and kG (gravity feedforward)
        
        // TODO: Set the motor power to the total power
        
        telemetry.addData("Target", targetPosition);
        telemetry.addData("Current", "your current position variable here");
        telemetry.addData("Error", "your error variable here");
        telemetry.addData("Power", "your power variable here");
        telemetry.update();
    }
}