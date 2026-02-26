import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DcMotorEx;

@TeleOp(name = "Velocity Control")
public class StudentCode extends LinearOpMode {

    static final double CRUISE_VELOCITY = 500.0; // ticks per second

    @Override
    public void runOpMode() {
        // TODO: Get leftMotor and rightMotor as DcMotorEx (not DcMotor)
        //       Use: DcMotorEx motor = hardwareMap.get(DcMotorEx.class, "name");

        // TODO: Set both motors to RUN_USING_ENCODER mode

        waitForStart();

        // TODO: Set both motors to CRUISE_VELOCITY using setVelocity()
    }
}