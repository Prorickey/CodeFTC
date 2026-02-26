import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl liftMotor = new DcMotorImpl();
        ServoImpl clawServo = new ServoImpl();
        hwMap.registerDevice("liftMotor", liftMotor);
        hwMap.registerDevice("clawServo", clawServo);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.gamepad1.a = true; // triggers both FSMs
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Lift motor is at full power (1.0)",
                liftMotor.getPower(), 1.0, 0.01);
        TestBase.assertNear("Claw servo is open (1.0)",
                clawServo.getPosition(), 1.0, 0.01);

        TestBase.printResults();
    }
}
