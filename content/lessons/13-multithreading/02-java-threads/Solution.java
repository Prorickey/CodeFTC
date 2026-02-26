import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import java.util.concurrent.atomic.AtomicInteger;

@TeleOp(name = "Java Threads")
public class StudentCode extends LinearOpMode {

    volatile boolean  threadRunning = true;
    AtomicInteger     counter       = new AtomicInteger(0);

    @Override
    public void runOpMode() throws InterruptedException {
        DcMotor motor = hardwareMap.get(DcMotor.class, "motor");

        Thread backgroundThread = new Thread(() -> {
            while (threadRunning) {
                counter.incrementAndGet();
                try {
                    Thread.sleep(5);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        backgroundThread.setDaemon(true);
        backgroundThread.start();

        waitForStart();

        motor.setPower(0.5);
        telemetry.addData("Count", counter.get());
        telemetry.update();

        threadRunning = false;
        backgroundThread.interrupt();
        backgroundThread.join();
    }
}
