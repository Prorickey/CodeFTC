import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        hwMap.registerDevice("testMotor", testMotor);
        ServoImpl testServo = new ServoImpl();
        hwMap.registerDevice("testServo", testServo);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = telemetry;
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        // Simulate left_stick_y = -0.75 (robot drives forward at 75%)
        op.gamepad1.left_stick_y = -0.75f;
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertNear("Motor power is 0.75 (negated stick value)",
                testMotor.getPower(), 0.75, 0.01);
        TestBase.assertContains("Telemetry shows \"Motor Power\"", log, "Motor Power");

        TestBase.printResults();
    }
}
