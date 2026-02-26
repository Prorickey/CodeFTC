import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl testMotor = new DcMotorImpl();
        testMotor.setCurrentPosition(537); // simulated encoder count
        hwMap.registerDevice("testMotor", testMotor);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = telemetry;
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertContains("Telemetry shows \"Position\"", log, "Position");
        TestBase.assertContains("Telemetry shows the encoder value (537)", log, "537");

        TestBase.printResults();
    }
}
