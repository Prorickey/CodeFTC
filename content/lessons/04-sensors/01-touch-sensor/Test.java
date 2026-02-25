import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl liftMotor = new DcMotorImpl();
        DigitalChannelImpl limitSwitch = new DigitalChannelImpl();
        limitSwitch.setState(false); // false = pressed
        hwMap.registerDevice("liftMotor", liftMotor);
        hwMap.registerDevice("limitSwitch", limitSwitch);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);

        try { op.runOpMode(); } catch (Exception ignored) {}

        TestBase.assertNear("Lift motor stops (power = 0.0) when limit switch is pressed",
                liftMotor.getPower(), 0.0, 0.01);

        TestBase.printResults();
    }
}
