import com.qualcomm.robotcore.hardware.*;
import org.firstinspires.ftc.robotcore.external.TelemetryImpl;

public class Test {
    public static void main(String[] args) throws Exception {
        HardwareMap hwMap = new HardwareMap();
        DcMotorImpl leftMotor  = new DcMotorImpl();
        DcMotorImpl rightMotor = new DcMotorImpl();
        hwMap.registerDevice("leftMotor",  leftMotor);
        hwMap.registerDevice("rightMotor", rightMotor);

        StudentCode op = new StudentCode();
        op.hardwareMap = hwMap;
        op.telemetry = new TelemetryImpl();
        op.gamepad1 = new Gamepad();
        op.gamepad2 = new Gamepad();
        op.setStarted(true);
        op.setMaxActiveLoops(0); // isBusy() returns false → busy loop exits immediately

        try { op.runOpMode(); } catch (Exception ignored) {}

        // 60 cm / (PI * 10 cm) * 537.7 ticks ≈ 1027 ticks
        int expectedTicks = (int)(60.0 / (Math.PI * 10.0) * 537.7);

        TestBase.assertEqual("Left motor mode is RUN_TO_POSITION",
                leftMotor.getMode().toString(), "RUN_TO_POSITION");
        TestBase.assertEqual("Right motor mode is RUN_TO_POSITION",
                rightMotor.getMode().toString(), "RUN_TO_POSITION");
        TestBase.check("Left motor target position ≈ " + expectedTicks + " ticks",
                Math.abs(leftMotor.getTargetPosition() - expectedTicks) <= 5,
                "Target = " + leftMotor.getTargetPosition(),
                "Expected ~" + expectedTicks + " but got " + leftMotor.getTargetPosition());
        TestBase.check("Right motor target position ≈ " + expectedTicks + " ticks",
                Math.abs(rightMotor.getTargetPosition() - expectedTicks) <= 5,
                "Target = " + rightMotor.getTargetPosition(),
                "Expected ~" + expectedTicks + " but got " + rightMotor.getTargetPosition());

        TestBase.printResults();
    }
}
