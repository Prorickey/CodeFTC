import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl motorA = new DcMotorImpl();
        DcMotorImpl motorB = new DcMotorImpl();
        hwMap.registerDevice("motorA", motorA);
        hwMap.registerDevice("motorB", motorB);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // motorA should have been set to 1.0 then stopped at 0.0
        TestBase.assertTrue("motorA was set to power 1.0 during its command",
                motorA.getCallLog().contains("setPower(1.0)"),
                "Expected setPower(1.0) in motorA call log");

        TestBase.assertNear("motorA is stopped at 0.0 after its command ends",
                motorA.getPower(), 0.0, 0.01);

        // motorB should have been set to 0.5 then stopped at 0.0
        TestBase.assertTrue("motorB was set to power 0.5 during its command",
                motorB.getCallLog().contains("setPower(0.5)"),
                "Expected setPower(0.5) in motorB call log");

        TestBase.assertNear("motorB is stopped at 0.0 after its command ends",
                motorB.getPower(), 0.0, 0.01);

        TestBase.printResults();
    }
}
