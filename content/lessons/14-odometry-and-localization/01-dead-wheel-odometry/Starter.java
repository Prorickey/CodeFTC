import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;

@Autonomous(name = "Dead Wheel Demo")
public class StudentCode extends LinearOpMode {

    static final double TICKS_PER_REV  = 2000.0;
    static final double WHEEL_DIAMETER = 0.048; // meters (48 mm)

    @Override
    public void runOpMode() {
        // TODO: Get "forwardEncoder" and "strafeEncoder" from hardwareMap as DcMotor objects.

        waitForStart();

        // TODO: Read the current position (ticks) from each encoder.

        // TODO: Compute forwardDist and strafeDist in meters.
        //       Use: dist = (ticks / TICKS_PER_REV) * (Math.PI * WHEEL_DIAMETER)

        // TODO: Display the results:
        //   telemetry.addData("Forward (m)", "%.4f", forwardDist);
        //   telemetry.addData("Strafe (m)",  "%.4f", strafeDist);
        //   telemetry.update();
    }
}
