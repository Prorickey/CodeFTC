import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DistanceSensor;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;
import java.util.concurrent.atomic.AtomicReference;

@TeleOp(name = "Async Sensor Reads")
public class StudentCode extends LinearOpMode {

    AtomicReference<Double> cachedDistance   = new AtomicReference<>(0.0);
    volatile boolean        sensorThreadRunning = true;

    @Override
    public void runOpMode() throws InterruptedException {
        DistanceSensor frontSensor = hardwareMap.get(DistanceSensor.class, "frontSensor");
        DcMotor        driveMotor  = hardwareMap.get(DcMotor.class, "driveMotor");

        Thread sensorThread = new Thread(() -> {
            while (sensorThreadRunning) {
                cachedDistance.set(frontSensor.getDistance(DistanceUnit.CM));
                try {
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    break;
                }
            }
        });
        sensorThread.setDaemon(true);
        sensorThread.start();
        Thread.sleep(50);

        waitForStart();

        double distance = cachedDistance.get();
        driveMotor.setPower(distance > 30.0 ? 0.5 : 0.0);
        telemetry.addData("Distance (cm)", distance);
        telemetry.update();

        sensorThreadRunning = false;
        sensorThread.interrupt();
        sensorThread.join(500);
    }
}
