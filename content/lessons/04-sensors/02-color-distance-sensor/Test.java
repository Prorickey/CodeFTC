import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl driveMotor = new DcMotorImpl();
        DistanceSensorImpl distanceSensor = new DistanceSensorImpl();
        distanceSensor.setDistanceCm(15.0); // 10 < 15 < 30 → half power (0.5)
        hwMap.registerDevice("driveMotor", driveMotor);
        hwMap.registerDevice("distanceSensor", distanceSensor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // 15 cm: not < 10, but < 30 → half power
        TestBase.assertNear("Motor runs at half power (0.5) when 10 cm < distance < 30 cm",
                driveMotor.getPower(), 0.5, 0.01);

        TestBase.printResults();
    }
}
