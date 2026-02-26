import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = telemetry;
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.gamepad1.left_stick_y  = -0.7f;
        op.gamepad1.right_stick_y = -0.5f;
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("leftMotor power = 0.7 (-left_stick_y)",
                leftMotor.getPower(), 0.7, 0.01);
        TestBase.assertNear("rightMotor power = 0.5 (-right_stick_y)",
                rightMotor.getPower(), 0.5, 0.01);

        TestBase.printResults();
    }
}
