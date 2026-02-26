import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;

@Autonomous(name = "Dead Wheel Demo")
public class StudentCode extends LinearOpMode {

    static final double TICKS_PER_REV  = 2000.0;
    static final double WHEEL_DIAMETER = 0.048; // meters (48 mm)

    @Override
    public void runOpMode() {
        DcMotor forwardEncoder = hardwareMap.get(DcMotor.class, "forwardEncoder");
        DcMotor strafeEncoder  = hardwareMap.get(DcMotor.class, "strafeEncoder");

        waitForStart();

        int forwardTicks = forwardEncoder.getCurrentPosition();
        int strafeTicks  = strafeEncoder.getCurrentPosition();

        double forwardDist = (forwardTicks / TICKS_PER_REV) * (Math.PI * WHEEL_DIAMETER);
        double strafeDist  = (strafeTicks  / TICKS_PER_REV) * (Math.PI * WHEEL_DIAMETER);

        telemetry.addData("Forward (m)", "%.4f", forwardDist);
        telemetry.addData("Strafe (m)",  "%.4f", strafeDist);
        telemetry.update();
    }
}
