import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@Autonomous(name = "IMU Turn")
public class StudentCode extends LinearOpMode {

    static final double TARGET_HEADING = 90.0;  // degrees
    static final double Kp             = 0.02;
    static final double THRESHOLD      = 2.0;   // stop when within 2 degrees

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");
        IMU imu = hardwareMap.get(IMU.class, "imu");

        waitForStart();

        // TODO: Loop while opModeIsActive()
        //       Inside the loop:
        //         1. Read the current heading from the IMU (getYaw in DEGREES)
        //         2. Calculate error = TARGET_HEADING - currentHeading
        //         3. Break out of the loop if Math.abs(error) < THRESHOLD
        //         4. Calculate correction = Kp * error
        //         5. Set leftMotor power  = +correction
        //            Set rightMotor power = -correction

        // TODO: Stop both motors after the loop
    }
}