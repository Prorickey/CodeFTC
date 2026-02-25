import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorExImpl leftMotor  = new DcMotorExImpl();
        DcMotorExImpl rightMotor = new DcMotorExImpl();
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertEqual("Left motor mode is RUN_USING_ENCODER",
                leftMotor.getMode().toString(), "RUN_USING_ENCODER");
        TestBase.assertEqual("Right motor mode is RUN_USING_ENCODER",
                rightMotor.getMode().toString(), "RUN_USING_ENCODER");
        TestBase.assertNear("Left motor velocity = 500 ticks/sec",
                leftMotor.getVelocity(), 500.0, 1.0);
        TestBase.assertNear("Right motor velocity = 500 ticks/sec",
                rightMotor.getVelocity(), 500.0, 1.0);

        TestBase.printResults();
    }
}
