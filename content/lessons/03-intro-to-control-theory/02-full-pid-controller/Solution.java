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
        
        int currentPosition = testMotor.getCurrentPosition();
        
        double error = targetPosition - currentPosition;
        
        double power = Kp * error;
        
        testMotor.setPower(power);
        
        telemetry.addData("Target", targetPosition);
        telemetry.addData("Current", currentPosition);
        telemetry.addData("Error", error);
        telemetry.addData("Power", power);
        telemetry.update();
    }
}