import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        ServoImpl clawServo = new ServoImpl();
        hwMap.registerDevice("clawServo", clawServo);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        // A pressed on this iteration — triggers the rising edge, toggling claw open
        op.gamepad1.a = true;
        op.setStarted(true);
        op.setMaxActiveLoops(2);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Claw servo opens to 1.0 on button press", clawServo.getPosition(), 1.0, 0.01);

        TestBase.printResults();
    }
}
