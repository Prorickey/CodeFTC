import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl armMotor = new DcMotorImpl();
        hwMap.registerDevice("armMotor", armMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(1);

        // Stick neutral — only gravity comp should be applied
        op.gamepad1.left_stick_y = 0.0f;

        try { op.runOpMode(); } catch (Exception ignored) {}

        // power = 0 + 0.1 = 0.1
        TestBase.assertNear("Arm holds with GRAVITY_COMP=0.1 when stick is neutral",
                armMotor.getPower(), 0.1, 0.01);

        // Reset and test with stick pushed up
        DcMotorImpl armMotor2 = new DcMotorImpl();
        HardwareMap hwMap2 = new HardwareMap();
        hwMap2.registerDevice("armMotor", armMotor2);

        StudentCode op2 = new StudentCode();
        op2.hardwareMap = hwMap2;
        op2.telemetry = new TelemetryImpl();
        op2.gamepad1 = new Gamepad();
        op2.gamepad2 = new Gamepad();
        op2.setStarted(true);
        op2.setMaxActiveLoops(1);

        op2.gamepad1.left_stick_y = -0.5f;  // -(-0.5) = 0.5 stick

        try { op2.runOpMode(); } catch (Exception ignored) {}

        // power = 0.5 + 0.1 = 0.6
        TestBase.assertNear("Arm power = stick + GRAVITY_COMP = 0.6",
                armMotor2.getPower(), 0.6, 0.01);

        TestBase.printResults();
    }
}
