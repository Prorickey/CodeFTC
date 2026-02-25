import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        ServoImpl testServo = new ServoImpl();
        hwMap.registerDevice("testServo", testServo);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.gamepad1.a = true;   // A pressed → open position (1.0)
        op.gamepad1.b = false;
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Servo moves to 1.0 when A is pressed", testServo.getPosition(), 1.0, 0.01);

        TestBase.printResults();
    }
}
