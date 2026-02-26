import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import java.util.concurrent.atomic.AtomicReference;

@TeleOp(name = "Thread Safety")
public class StudentCode extends LinearOpMode {

    AtomicReference<Double> cachedPower    = new AtomicReference<>(0.0);
    AtomicReference<Double> cachedPosition = new AtomicReference<>(0.0);

    @Override
    public void runOpMode() throws InterruptedException {
        DcMotor motor = hardwareMap.get(DcMotor.class, "motor");

        Thread writer = new Thread(() -> {
            cachedPower.set(0.75);
            cachedPosition.set(1234.0);
        });
        writer.start();
        writer.join();

        waitForStart();

        motor.setPower(cachedPower.get());
        telemetry.addData("Position", cachedPosition.get());
        telemetry.update();
    }
}
