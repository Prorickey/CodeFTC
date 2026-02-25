import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Arm with Gravity Comp")
public class StudentCode extends LinearOpMode {

    static final double GRAVITY_COMP = 0.1;   // feedforward power to hold arm up

    @Override
    public void runOpMode() {
        DcMotor armMotor = hardwareMap.get(DcMotor.class, "armMotor");
        armMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        armMotor.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);

        waitForStart();

        while (opModeIsActive()) {
            double stick = -gamepad1.left_stick_y;

            // TODO: Compute power = stick + GRAVITY_COMP
            //       Set armMotor power to power


            telemetry.addData("Stick", stick);
            telemetry.addData("Power", armMotor.getPower());
            telemetry.update();
        }
    }
}