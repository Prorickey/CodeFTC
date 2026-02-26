import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import java.util.concurrent.atomic.AtomicInteger;

@TeleOp(name = "Java Threads")
public class StudentCode extends LinearOpMode {

    // TODO: Declare a volatile boolean threadRunning = true
    // TODO: Declare an AtomicInteger counter = new AtomicInteger(0)

    @Override
    public void runOpMode() throws InterruptedException {
        DcMotor motor = hardwareMap.get(DcMotor.class, "motor");

        // TODO: Create a background Thread that:
        //       - Loops while threadRunning is true
        //       - Calls counter.incrementAndGet()
        //       - Calls Thread.sleep(5) (handle InterruptedException by breaking)
        // TODO: Set the thread as a daemon and start it

        waitForStart();

        // TODO: Set motor power to 0.5
        // TODO: Log counter.get() to telemetry as "Count"
        telemetry.update();

        // TODO: Set threadRunning = false, interrupt, and join the thread
    }
}
