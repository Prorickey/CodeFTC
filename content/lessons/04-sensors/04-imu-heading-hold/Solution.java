import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@TeleOp(name = "Heading Hold")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        IMU imu = hardwareMap.get(IMU.class, "imu");
        IMU.Parameters parameters = new IMU.Parameters(
            new RevHubOrientationOnRobot(
                RevHubOrientationOnRobot.LogoFacingDirection.UP,
                RevHubOrientationOnRobot.UsbFacingDirection.FORWARD
            )
        );
        imu.initialize(parameters);
        
        DcMotor leftMotor = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");
        
        double targetHeading = 0.0;
        double drivePower = 0.5;
        double Kp = 0.02;
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        YawPitchRollAngles angles = imu.getRobotYawPitchRollAngles();
        double currentHeading = angles.getYaw(AngleUnit.DEGREES);
        
        double error = targetHeading - currentHeading;
        double turnPower = Kp * error;
        
        double leftPower = drivePower + turnPower;
        double rightPower = drivePower - turnPower;
        
        leftMotor.setPower(leftPower);
        rightMotor.setPower(rightPower);
    }
}