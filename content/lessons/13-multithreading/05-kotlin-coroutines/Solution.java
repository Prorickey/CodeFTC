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

        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(
                () -> cachedDistance.set(frontSensor.getDistance(DistanceUnit.CM)),
                0, 20, TimeUnit.MILLISECONDS
        );

        Thread.sleep(50);

        waitForStart();

        double distance = cachedDistance.get();
        driveMotor.setPower(distance > 30.0 ? 0.5 : 0.0);
        telemetry.addData("Distance (cm)", distance);
        telemetry.update();

        scheduler.shutdownNow();
    }
}
