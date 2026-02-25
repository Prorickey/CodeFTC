import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DigitalChannel;

@TeleOp(name = "Touch Sensor")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DigitalChannel limitSwitch = hardwareMap.get(DigitalChannel.class, "limitSwitch");
        limitSwitch.setMode(DigitalChannel.Mode.INPUT);
        
        DcMotor liftMotor = hardwareMap.get(DcMotor.class, "liftMotor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        boolean isPressed = !limitSwitch.getState();
        
        if (isPressed) {
            liftMotor.setPower(0.0);
        } else {
            liftMotor.setPower(0.5);
        }
    }
}