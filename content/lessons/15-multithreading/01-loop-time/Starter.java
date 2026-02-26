import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.util.ElapsedTime;

@TeleOp(name = "Loop Time Monitor")
public class StudentCode extends LinearOpMode {

    // TODO: Declare an ElapsedTime loopTimer here

    @Override
    public void runOpMode() {
        DcMotor leftMotor  = hardwareMap.get(DcMotor.class, "leftMotor");
        DcMotor rightMotor = hardwareMap.get(DcMotor.class, "rightMotor");

        waitForStart();

        while (opModeIsActive()) {
            // TODO: Reset loopTimer at the top of the loop

            // TODO: Set motor powers from gamepad (negate Y axis)

            // TODO: Log loopTimer.milliseconds() as "Loop ms"
            // TODO: Call telemetry.update()
        }
    }
}
