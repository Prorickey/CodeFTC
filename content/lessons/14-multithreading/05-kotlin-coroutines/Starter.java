import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DistanceSensor;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@TeleOp(name = "Executor Pattern")
public class StudentCode extends LinearOpMode {

    AtomicReference<Double> cachedDistance = new AtomicReference<>(0.0);

    @Override
    public void runOpMode() throws InterruptedException {
        DistanceSensor frontSensor = hardwareMap.get(DistanceSensor.class, "frontSensor");
        DcMotor        driveMotor  = hardwareMap.get(DcMotor.class, "driveMotor");

        // TODO: Create a ScheduledExecutorService using Executors.newSingleThreadScheduledExecutor()

        // TODO: Call scheduler.scheduleAtFixedRate() to read frontSensor.getDistance(DistanceUnit.CM)
        //       into cachedDistance every 20ms, starting immediately (initial delay = 0)

        // TODO: Sleep 50ms so at least one read completes before waitForStart()

        waitForStart();

        // TODO: Read cachedDistance.get()
        // TODO: Set driveMotor power to 0.5 if distance > 30.0, else 0.0
        // TODO: Log distance to telemetry, call telemetry.update()

        // TODO: Call scheduler.shutdownNow() to stop the scheduler
    }
}
