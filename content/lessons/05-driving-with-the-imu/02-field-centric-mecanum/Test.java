import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl frontLeft  = new DcMotorImpl();
        DcMotorImpl frontRight = new DcMotorImpl();
        DcMotorImpl backLeft   = new DcMotorImpl();
        DcMotorImpl backRight  = new DcMotorImpl();
        hwMap.registerDevice("frontLeft",  frontLeft);
        hwMap.registerDevice("frontRight", frontRight);
        hwMap.registerDevice("backLeft",   backLeft);
        hwMap.registerDevice("backRight",  backRight);

        IMUImpl imu = new IMUImpl();
        // yaw starts at 0 — student code calls resetYaw() which keeps it at 0
        hwMap.registerDevice("imu", imu);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        // Push stick straight forward; at heading=0, field-centric == robot-centric
        // y = 1.0, x = 0.0, rx = 0.0
        op.gamepad1.left_stick_y = -1.0f;
        op.gamepad1.left_stick_x = 0.0f;
        op.gamepad1.right_stick_x = 0.0f;

        try { op.runOpMode(); } catch (Exception ignored) {}

        // With heading=0: rotX=0, rotY=1
        // fl = 1+0+0=1, fr=1-0-0=1, bl=1-0+0=1, br=1+0-0=1
        // frontLeft and backLeft are reversed, so they store power as-is (DcMotorImpl stores raw power)
        // We verify the IMU was used
        TestBase.assertTrue("IMU getRobotYawPitchRollAngles was called",
                imu.callLog.contains("getRobotYawPitchRollAngles()"));
        TestBase.assertTrue("IMU resetYaw was called",
                imu.callLog.contains("resetYaw()"));

        // At heading=0, forward drive: all motors should have same magnitude
        TestBase.assertNear("All motors equal magnitude on straight forward drive",
                Math.abs(frontLeft.getPower()), Math.abs(frontRight.getPower()), 0.05);

        TestBase.printResults();
    }
}
