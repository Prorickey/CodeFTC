import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@TeleOp(name = "Sensor Fusion")
public class StudentCode extends LinearOpMode {

    static final double COUNTS_PER_DEGREE = 10.0;
    static final double ALPHA             = 0.5;   // 50% encoders, 50% IMU
    static final double Kp                = 0.02;
    static final double TARGET_HEADING    = 0.0;
    static final double DRIVE_POWER       = 0.5;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        IMU imu = hardwareMap.get(IMU.class, "imu");
        imu.initialize(new IMU.Parameters(
            new RevHubOrientationOnRobot(
                RevHubOrientationOnRobot.LogoFacingDirection.UP,
                RevHubOrientationOnRobot.UsbFacingDirection.FORWARD
            )
        ));

        waitForStart();

        // TODO: Compute encoderHeading from encoder positions / COUNTS_PER_DEGREE

        // TODO: Read imuHeading from the IMU yaw (degrees)

        // TODO: Compute fusedHeading using the complementary filter

        // TODO: Compute error, turnPower, leftPower, rightPower
        // TODO: Set motor powers
    }
}
