import com.qualcomm.robotcore.eventloop.opmode.Autonomous;
import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.util.ElapsedTime;

@Autonomous(name = "Timed Drive")
public class StudentCode extends LinearOpMode {
    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        waitForStart();

        ElapsedTime timer = new ElapsedTime();

        // TODO: Set both motors to 0.7 power

        // TODO: Loop while opModeIsActive() AND timer.seconds() < 2.0
        //       Inside the loop, add telemetry showing the elapsed time

        // TODO: After the loop, stop both motors (set power to 0.0)
    }
}