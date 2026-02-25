import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl driveMotor = new DcMotorImpl();
        ServoImpl clawServo = new ServoImpl();
        hwMap.registerDevice("driveMotor", driveMotor);
        hwMap.registerDevice("clawServo", clawServo);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();

        op.init();

        // Loop 1: button not pressed
        op.gamepad1.a = false;
        op.gamepad1.left_stick_y = -0.5f;
        op.loop();

        TestBase.assertNear("Drive power = 0.5 after first loop",
                driveMotor.getPower(), 0.5, 0.01);

        // Loop 2: button pressed — claw should toggle open
        op.gamepad1.a = true;
        op.loop();

        TestBase.assertNear("Claw opens to 1.0 on button press",
                clawServo.getPosition(), 1.0, 0.01);

        // Loop 3: button still held — should NOT toggle again
        op.gamepad1.a = true;
        op.loop();

        TestBase.assertNear("Claw stays open while button held",
                clawServo.getPosition(), 1.0, 0.01);

        // Loop 4: button released then pressed again — should toggle closed
        op.gamepad1.a = false;
        op.loop();
        op.gamepad1.a = true;
        op.loop();

        TestBase.assertNear("Claw closes to 0.0 on second press",
                clawServo.getPosition(), 0.0, 0.01);

        TestBase.printResults();
    }
}
