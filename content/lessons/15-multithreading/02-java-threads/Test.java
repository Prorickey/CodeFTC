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

        TestBase.assertNear("Motor power is set to 0.5",
                motor.getPower(), 0.5, 0.01);

        TestBase.assertTrue("Background thread incremented counter at least once",
                op.counter.get() >= 1,
                "Counter was " + op.counter.get() + ", expected >= 1");

        TestBase.printResults();
    }
}
