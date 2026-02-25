import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Debug Exercise")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // BUG: This motor initialization is in the wrong place!
        // It should happen BEFORE waitForStart()
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        
        // TODO: Fix the order so the motor is obtained before waitForStart()
        // and the power is set after waitForStart()
        driveMotor.setPower(1.0);
        
        telemetry.addData("Status", "Running");
        telemetry.addData("Motor Power", driveMotor.getPower());
        telemetry.update();
    }
}