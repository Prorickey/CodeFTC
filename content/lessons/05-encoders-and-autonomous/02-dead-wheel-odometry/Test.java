import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;
import java.util.List;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();

        DcMotorImpl forwardEncoder = new DcMotorImpl();
        DcMotorImpl strafeEncoder  = new DcMotorImpl();
        forwardEncoder.setCurrentPosition(2000); // 1 full revolution forward
        strafeEncoder.setCurrentPosition(500);   // 1/4 revolution strafe

        hwMap.registerDevice("forwardEncoder", forwardEncoder);
        hwMap.registerDevice("strafeEncoder",  strafeEncoder);

        TelemetryImpl telemetry = new TelemetryImpl();

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = telemetry;
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        List<String> log = telemetry.getLog();

        // forward: 2000/2000 * pi*0.048 = 0.15079... m
        double expectedForward = (2000.0 / 2000.0) * (Math.PI * 0.048);
        // strafe: 500/2000 * pi*0.048 = 0.03769... m
        double expectedStrafe  = (500.0  / 2000.0) * (Math.PI * 0.048);

        TestBase.assertContains("Telemetry shows \"Forward (m)\" caption", log, "Forward (m)");
        TestBase.assertContains("Telemetry shows \"Strafe (m)\" caption",  log, "Strafe (m)");

        // Parse values from telemetry log
        double actualForward = Double.NaN, actualStrafe = Double.NaN;
        for (String entry : log) {
            if (entry.startsWith("Forward (m):")) {
                try { actualForward = Double.parseDouble(entry.replace("Forward (m):", "").trim()); } catch (Exception ignored2) {}
            }
            if (entry.startsWith("Strafe (m):")) {
                try { actualStrafe = Double.parseDouble(entry.replace("Strafe (m):", "").trim()); } catch (Exception ignored2) {}
            }
        }

        TestBase.assertNear("Forward distance ≈ 0.1508 m (1 revolution × 48 mm wheel)",
                actualForward, expectedForward, 0.001);
        TestBase.assertNear("Strafe distance ≈ 0.0377 m (¼ revolution × 48 mm wheel)",
                actualStrafe, expectedStrafe, 0.001);

        TestBase.printResults();
    }
}
