import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Debug Exercise")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        driveMotor.setPower(1.0);
        
        telemetry.addData("Status", "Running");
        telemetry.addData("Motor Power", driveMotor.getPower());
        telemetry.update();
    }
}