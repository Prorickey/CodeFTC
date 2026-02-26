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

        leftMotor.setPower(0.7);
        rightMotor.setPower(0.7);

        while (opModeIsActive() && timer.seconds() < 2.0) {
            telemetry.addData("Time", timer.seconds());
            telemetry.update();
        }

        leftMotor.setPower(0.0);
        rightMotor.setPower(0.0);
    }
}