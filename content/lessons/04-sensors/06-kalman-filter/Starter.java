import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@TeleOp(name = "Kalman Filter")
public class StudentCode extends LinearOpMode {

    static final double Kp          = 0.02;
    static final double TARGET      = 0.0;
    static final double DRIVE_POWER = 0.5;

    // TODO: Implement a KalmanFilter class here with:
    //   - Fields: x (estimate), p (uncertainty), q (process noise), r (measurement noise)
    //   - Constructor: KalmanFilter(double x0, double p0, double q, double r)
    //   - Method: double update(double measurement) — runs predict then update, returns new estimate
    //   - Method: double getEstimate()

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

        // TODO: Create a KalmanFilter: initial estimate 0.0, uncertainty 1.0, q=0.1, r=1.0

        // TODO: Read raw IMU heading

        // TODO: Call filter.update(rawHeading) to get filteredHeading

        // TODO: Compute error, turnPower, leftPower, rightPower and set motor powers
    }
}
