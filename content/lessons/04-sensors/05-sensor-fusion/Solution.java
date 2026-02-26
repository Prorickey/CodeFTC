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
    static final double ALPHA             = 0.5;
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

        double encoderHeading = (rightMotor.getCurrentPosition()
                               - leftMotor.getCurrentPosition()) / COUNTS_PER_DEGREE;

        YawPitchRollAngles angles = imu.getRobotYawPitchRollAngles();
        double imuHeading = angles.getYaw(AngleUnit.DEGREES);

        double fusedHeading = ALPHA * encoderHeading + (1.0 - ALPHA) * imuHeading;

        double error      = TARGET_HEADING - fusedHeading;
        double turnPower  = Kp * error;
        double leftPower  = DRIVE_POWER + turnPower;
        double rightPower = DRIVE_POWER - turnPower;

        leftMotor.setPower(leftPower);
        rightMotor.setPower(rightPower);
    }
}
