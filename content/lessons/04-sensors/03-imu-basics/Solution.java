import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;
import com.qualcomm.robotcore.hardware.IMU;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import org.firstinspires.ftc.robotcore.external.navigation.YawPitchRollAngles;

@TeleOp(name = "IMU Basics")
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
        
        telemetry.addData("Status", "IMU Initialized");
        telemetry.update();
        
        waitForStart();
        
        YawPitchRollAngles angles = imu.getRobotYawPitchRollAngles();
        double heading = angles.getYaw(AngleUnit.DEGREES);
        
        telemetry.addData("Heading", heading);
        telemetry.update();
    }
}