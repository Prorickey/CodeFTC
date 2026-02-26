import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DistanceSensor;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;
import java.util.concurrent.atomic.AtomicReference;

@TeleOp(name = "Async Sensor Reads")
public class StudentCode extends LinearOpMode {

    // TODO: Declare AtomicReference<Double> cachedDistance initialized to 0.0
    // TODO: Declare volatile boolean sensorThreadRunning = true

    @Override
    public void runOpMode() throws InterruptedException {
        DistanceSensor frontSensor = hardwareMap.get(DistanceSensor.class, "frontSensor");
        DcMotor        driveMotor  = hardwareMap.get(DcMotor.class, "driveMotor");

        // TODO: Create a Thread that:
        //       - Loops while sensorThreadRunning
        //       - Reads frontSensor.getDistance(DistanceUnit.CM) and stores in cachedDistance
        //       - Sleeps 20ms (handle InterruptedException by breaking)
        // TODO: Set as daemon, start, then sleep 50ms to let it read once

        waitForStart();

        // TODO: One loop iteration:
        //       - Read cachedDistance.get()
        //       - Set driveMotor power to 0.5 if distance > 30.0, else 0.0
        //       - Log distance to telemetry, call telemetry.update()

        // TODO: Shut down: set sensorThreadRunning=false, interrupt, join
    }
}
