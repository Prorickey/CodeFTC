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
        
        double distance = rangeSensor.getDistance(DistanceUnit.CM);
        
        if (distance < 10) {
            driveMotor.setPower(0.0);
        } else if (distance < 30) {
            driveMotor.setPower(0.5);
        } else {
            driveMotor.setPower(1.0);
        }
        
        telemetry.addData("Distance", distance);
        telemetry.addData("Motor Power", driveMotor.getPower());
        telemetry.update();
    }
}