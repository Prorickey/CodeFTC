import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

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
        // Run enough loops to ramp from 0 to 1.0 (1.0 / 0.05 = 20 loops)
        op.setMaxActiveLoops(25);

        op.gamepad1.left_stick_y = -1.0f;  // target = 1.0

        try { op.runOpMode(); } catch (Exception ignored) {}

        // After 25 loops at MAX_RAMP=0.05, currentPower should reach 1.0
        TestBase.assertNear("Left motor reaches 1.0 after enough ramp loops",
                leftMotor.getPower(), 1.0, 0.01);
        TestBase.assertNear("Right motor reaches 1.0 after enough ramp loops",
                rightMotor.getPower(), 1.0, 0.01);

        TestBase.printResults();
    }
}
