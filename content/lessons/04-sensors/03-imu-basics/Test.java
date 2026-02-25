import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        IMUImpl imu = new IMUImpl();
        imu.setYaw(45.0); // simulated heading of 45°
        hwMap.registerDevice("imu", imu);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = telemetry;
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        TestBase.assertContains("Telemetry shows \"Heading\"", log, "Heading");
        TestBase.assertContains("Telemetry shows the yaw value (45)", log, "45");

        TestBase.printResults();
    }
}
