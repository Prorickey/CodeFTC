import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();

        DistanceSensorImpl frontSensor = new DistanceSensorImpl();
        frontSensor.setDistanceCm(45.0);   // 45cm > 30cm threshold

        DcMotorImpl driveMotor = new DcMotorImpl();
        hwMap.registerDevice("frontSensor", frontSensor);
        hwMap.registerDevice("driveMotor",  driveMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry   = new TelemetryImpl();
        op.gamepad1    = new Gamepad();
        op.gamepad2    = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertTrue("Scheduler read frontSensor at least once",
                !frontSensor.getCallLog().isEmpty(),
                "frontSensor.getDistance() was never called by the scheduled task");

        TestBase.assertNear("driveMotor power is 0.5 (distance 45cm > 30cm threshold)",
                driveMotor.getPower(), 0.5, 0.01);

        TestBase.printResults();
    }
}
