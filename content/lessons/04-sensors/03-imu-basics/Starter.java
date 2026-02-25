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
        // TODO: Get the IMU from the hardware map
        //       IMU imu = hardwareMap.get(IMU.class, "imu");
        
        // TODO: Create IMU.Parameters with RevHubOrientationOnRobot
        //       Logo facing UP, USB facing FORWARD
        
        // TODO: Initialize the IMU with the parameters
        //       imu.initialize(parameters);
        
        telemetry.addData("Status", "IMU Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Get the robot's yaw/pitch/roll angles
        //       YawPitchRollAngles angles = imu.getRobotYawPitchRollAngles();
        
        // TODO: Read the yaw (heading) in degrees
        //       double heading = angles.getYaw(AngleUnit.DEGREES);
        
        // TODO: Display the heading on telemetry with caption "Heading"
        //       Don't forget telemetry.update()!
    }
}