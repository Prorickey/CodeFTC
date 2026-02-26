import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl motor = new DcMotorImpl();
        hwMap.registerDevice("motor", motor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = new TelemetryImpl();
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Motor power is 0.75 (read from AtomicReference)",
                motor.getPower(), 0.75, 0.01);

        TestBase.assertNear("cachedPosition is 1234.0",
                op.cachedPosition.get(), 1234.0, 0.01);

        TestBase.printResults();
    }
}
