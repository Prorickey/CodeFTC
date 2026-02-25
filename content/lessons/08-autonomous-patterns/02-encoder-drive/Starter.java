import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;

@Autonomous(name = "Encoder Drive")
public class StudentCode extends LinearOpMode {

    static final double TICKS_PER_REV      = 537.7;
    static final double WHEEL_DIAMETER_CM  = 10.0;
    static final double TARGET_CM          = 60.0;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        // TODO: Reset encoders on both motors (STOP_AND_RESET_ENCODER)

        // TODO: Calculate targetTicks from TARGET_CM, WHEEL_DIAMETER_CM, and TICKS_PER_REV
        //       Hint: circumference = Math.PI * WHEEL_DIAMETER_CM
        //             targetTicks = (int)(TARGET_CM / circumference * TICKS_PER_REV)

        // TODO: Set target position on both motors

        // TODO: Set both motors to RUN_TO_POSITION mode

        waitForStart();

        // TODO: Set both motors to 0.5 power to start moving

        // TODO: Wait while opModeIsActive() and either motor is still busy

        // TODO: Stop both motors
    }
}