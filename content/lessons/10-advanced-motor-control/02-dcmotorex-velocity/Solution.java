import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DcMotorEx;

@TeleOp(name = "Velocity Control")
public class StudentCode extends LinearOpMode {

    static final double CRUISE_VELOCITY = 500.0;

    @Override
    public void runOpMode() {
        DcMotorEx leftMotor  = hardwareMap.get(DcMotorEx.class, "leftMotor");
        DcMotorEx rightMotor = hardwareMap.get(DcMotorEx.class, "rightMotor");

        leftMotor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        rightMotor.setMode(DcMotor.RunMode.RUN_USING_ENCODER);

        waitForStart();

        leftMotor.setVelocity(CRUISE_VELOCITY);
        rightMotor.setVelocity(CRUISE_VELOCITY);
    }
}