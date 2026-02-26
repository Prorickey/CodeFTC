import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import java.util.concurrent.atomic.AtomicReference;

@TeleOp(name = "Thread Safety")
public class StudentCode extends LinearOpMode {

    // TODO: Declare AtomicReference<Double> cachedPower   initialized to 0.0
    // TODO: Declare AtomicReference<Double> cachedPosition initialized to 0.0

    @Override
    public void runOpMode() throws InterruptedException {
        DcMotor motor = hardwareMap.get(DcMotor.class, "motor");

        // TODO: Create a thread that sets cachedPower to 0.75
        //       and cachedPosition to 1234.0, then finishes
        // TODO: Start the thread and join() it

        waitForStart();

        // TODO: Read cachedPower.get() and set motor power to that value
        // TODO: Log cachedPosition.get() to telemetry as "Position"
        telemetry.update();
    }
}
