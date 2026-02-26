import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Telemetry Dashboard")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor testMotor = hardwareMap.get(DcMotor.class, "testMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        double power = -gamepad1.left_stick_y;
        testMotor.setPower(power);
        
        telemetry.addData("Motor Power", power);
        telemetry.addData("Status", "Running");
        telemetry.update();
    }
}