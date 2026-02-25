import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@Autonomous(name = "IMU Turn")
public class StudentCode extends LinearOpMode {

    static final double TARGET_HEADING = 90.0;
    static final double Kp             = 0.02;
    static final double THRESHOLD      = 2.0;

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");
        IMU imu = hardwareMap.get(IMU.class, "imu");

        waitForStart();

        while (opModeIsActive()) {
            double currentHeading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.DEGREES);
            double error = TARGET_HEADING - currentHeading;

            if (Math.abs(error) < THRESHOLD) break;

            double correction = Kp * error;
            leftMotor.setPower(correction);
            rightMotor.setPower(-correction);

            telemetry.addData("Heading", currentHeading);
            telemetry.addData("Error",   error);
            telemetry.update();
        }

        leftMotor.setPower(0.0);
        rightMotor.setPower(0.0);
    }
}