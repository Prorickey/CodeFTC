import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        final double BATTERY_VOLTAGE  = 10.5;
        final double NOMINAL_VOLTAGE  = 12.0;
        final double TARGET_POWER     = 0.7;
        final double EXPECTED_POWER   = Math.min(1.0, TARGET_POWER * (NOMINAL_VOLTAGE / BATTERY_VOLTAGE));

        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl motor = new DcMotorImpl();
        hwMap.registerDevice("motor", motor);

        VoltageSensorImpl voltageSensor = new VoltageSensorImpl(BATTERY_VOLTAGE);
        hwMap.registerVoltageSensor(voltageSensor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = new TelemetryImpl();
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear(
            "Motor power is normalized for " + BATTERY_VOLTAGE + "V battery (expected ≈ " + EXPECTED_POWER + ")",
            motor.getPower(), EXPECTED_POWER, 0.01);

        TestBase.assertTrue(
            "Motor power does not exceed 1.0 (clamped)",
            motor.getPower() <= 1.0,
            "Power was " + motor.getPower() + ", must be clamped to 1.0");

        TestBase.printResults();
    }
}
