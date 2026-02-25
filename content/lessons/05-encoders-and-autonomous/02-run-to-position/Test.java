import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        hwMap.registerDevice("testMotor", testMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertEqual("Motor mode is RUN_TO_POSITION",
                testMotor.getMode().toString(), "RUN_TO_POSITION");
        TestBase.check("Target position is 1000",
                testMotor.getTargetPosition() == 1000,
                "Target position = 1000",
                "Expected target 1000 but got " + testMotor.getTargetPosition());
        TestBase.assertNear("Motor power is 0.5", testMotor.getPower(), 0.5, 0.01);

        TestBase.printResults();
    }
}
