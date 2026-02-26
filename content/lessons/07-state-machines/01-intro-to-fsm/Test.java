import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl liftMotor = new DcMotorImpl();
        hwMap.registerDevice("liftMotor", liftMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.gamepad1.a = true; // A pressed → IDLE transitions to RAISING on iteration 1
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        // Iteration 1: IDLE detects A → state = RAISING
        // Iteration 2: RAISING → setPower(1.0)
        TestBase.assertNear("Lift motor is at full power (1.0) after transitioning to RAISING",
                liftMotor.getPower(), 1.0, 0.01);

        TestBase.printResults();
    }
}
