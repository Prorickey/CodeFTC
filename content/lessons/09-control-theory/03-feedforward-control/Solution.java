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
        double kG = 0.1;
        
        telemetry.addData("Status", "Initialized");
        telemetry.addData("Target", targetPosition);
        telemetry.update();
        
        waitForStart();
        
        int currentPosition = armMotor.getCurrentPosition();
        
        double error = targetPosition - currentPosition;
        
        double pTerm = Kp * error;
        
        double totalPower = pTerm + kG;
        
        armMotor.setPower(totalPower);
        
        telemetry.addData("Target", targetPosition);
        telemetry.addData("Current", currentPosition);
        telemetry.addData("Error", error);
        telemetry.addData("Power", totalPower);
        telemetry.update();
    }
}