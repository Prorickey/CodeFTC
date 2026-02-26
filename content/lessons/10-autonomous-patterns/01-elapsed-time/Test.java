import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> leftLog  = leftMotor.callLog;
        List<String> rightLog = rightMotor.callLog;

        // Motors must have been running at 0.7 at some point
        TestBase.assertTrue("Left motor ran at 0.7 during the timed loop",
                leftLog.contains("setPower(0.7)"),
                "leftMotor.setPower(0.7) was never called — start the motors before the while loop");
        TestBase.assertTrue("Right motor ran at 0.7 during the timed loop",
                rightLog.contains("setPower(0.7)"),
                "rightMotor.setPower(0.7) was never called — start the motors before the while loop");

        // Motors must be stopped after the loop
        TestBase.assertNear("Left motor stopped (0.0) after timed loop",
                leftMotor.getPower(), 0.0, 0.001);
        TestBase.assertNear("Right motor stopped (0.0) after timed loop",
                rightMotor.getPower(), 0.0, 0.001);

        TestBase.printResults();
    }
}
