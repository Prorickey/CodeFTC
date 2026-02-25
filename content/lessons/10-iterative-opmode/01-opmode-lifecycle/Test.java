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

        // Call init()
        op.init();

        // Simulate one loop() call with stick pushed forward
        op.gamepad1.left_stick_y = -0.6f;
        op.loop();

        // -(-0.6) = 0.6
        TestBase.assertNear("driveMotor power = 0.6 (-left_stick_y)",
                driveMotor.getPower(), 0.6, 0.01);

        TestBase.printResults();
    }
}
