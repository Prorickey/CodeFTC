import com.qualcomm.robotcore.eventloop.opmode.OpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.Servo;
import com.qualcomm.robotcore.util.ElapsedTime;

@TeleOp(name = "Non-Blocking Patterns")
public class StudentCode extends OpMode {

    DcMotor driveMotor;
    Servo clawServo;
    ElapsedTime timer = new ElapsedTime();
    boolean clawOpen = false;
    boolean prevButton = false;

    @Override
    public void init() {
        driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");
        clawServo   = hardwareMap.get(Servo.class,   "clawServo");
    }

    @Override
    public void loop() {
        // TODO: Drive with left stick Y (negate)
        driveMotor.setPower(-gamepad1.left_stick_y);

        // TODO: Toggle clawOpen when gamepad1.a is pressed (rising edge only).
        //       Use prevButton to detect a press (was false, now true).
        //       After toggling, set clawServo position:
        //         open  → 1.0
        //         closed → 0.0


        prevButton = gamepad1.a;

        telemetry.addData("Claw open", clawOpen);
        telemetry.addData("Drive power", driveMotor.getPower());
        telemetry.update();
    }
}