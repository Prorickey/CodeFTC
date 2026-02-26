import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl driveMotor = new DcMotorImpl();
        hwMap.registerDevice("driveMotor", driveMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Drive motor power is 1.0 (bug fixed — hardware init before waitForStart)",
                driveMotor.getPower(), 1.0, 0.01);

        TestBase.printResults();
    }
}
