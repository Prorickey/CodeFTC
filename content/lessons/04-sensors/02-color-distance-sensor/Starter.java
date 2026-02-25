import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.DistanceSensor;
import org.firstinspires.ftc.robotcore.external.navigation.DistanceUnit;

@TeleOp(name = "Distance Sensor")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        DistanceSensor rangeSensor = hardwareMap.get(DistanceSensor.class, "rangeSensor");
        
        telemetry.addData("Status", "Initialized");
        telemetry.update();
        
        waitForStart();
        
        // TODO: Read the distance from rangeSensor in centimeters
        //       Use rangeSensor.getDistance(DistanceUnit.CM)
        
        // TODO: If distance < 10: set driveMotor power to 0.0 (stop)
        // TODO: Else if distance < 30: set driveMotor power to 0.5 (slow)
        // TODO: Else: set driveMotor power to 1.0 (full speed)
        
        telemetry.addData("Distance", "TODO: put distance variable here");
        telemetry.addData("Motor Power", driveMotor.getPower());
        telemetry.update();
    }
}