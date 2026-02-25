import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "First Motor")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor testMotor = hardwareMap.get(DcMotor.class, "testMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        testMotor.setPower(0.5);
        
        telemetry.addData("Status", "Running");
        telemetry.update();
    }
}