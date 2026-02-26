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

    class KalmanFilter {
        private double x;   // Estimate
        private double p;   // Uncertainty
        private double q;   // Process noise
        private double r;   // Measurement noise

        KalmanFilter(double x0, double p0, double q, double r) {
            this.x = x0;
            this.p = p0;
            this.q = q;
            this.r = r;
        }

        double update(double measurement) {
            // Predict
            p = p + q;

            // Update
            double k = p / (p + r);
            x = x + k * (measurement - x);
            p = (1.0 - k) * p;

            return x;
        }

        double getEstimate() { return x; }
    }

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

        KalmanFilter filter = new KalmanFilter(0.0, 1.0, 0.1, 1.0);

        double rawHeading      = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.DEGREES);
        double filteredHeading = filter.update(rawHeading);

        double error      = TARGET - filteredHeading;
        double turnPower  = Kp * error;
        double leftPower  = DRIVE_POWER + turnPower;
        double rightPower = DRIVE_POWER - turnPower;

        leftMotor.setPower(leftPower);
        rightMotor.setPower(rightPower);
    }
}
