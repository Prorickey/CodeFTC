import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Field Centric Drive")
public class StudentCode extends LinearOpMode {

    @Override
    public void runOpMode() {
        DcMotor frontLeft  = hardwareMap.get(DcMotor.class, "frontLeft");
        DcMotor frontRight = hardwareMap.get(DcMotor.class, "frontRight");
        DcMotor backLeft   = hardwareMap.get(DcMotor.class, "backLeft");
        DcMotor backRight  = hardwareMap.get(DcMotor.class, "backRight");

        frontLeft.setDirection(DcMotor.Direction.REVERSE);
        backLeft.setDirection(DcMotor.Direction.REVERSE);

        waitForStart();

        while (opModeIsActive()) {
            double y  = -gamepad1.left_stick_y;   // forward
            double x  =  gamepad1.left_stick_x;   // strafe
            double rx =  gamepad1.right_stick_x;  // rotation

            // TODO: Read the robot's heading from the IMU.
            //       Use: double heading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.RADIANS);
            //       Then rotate the (x, y) vector by -heading:
            //         double rotX = x * Math.cos(-heading) - y * Math.sin(-heading);
            //         double rotY = x * Math.sin(-heading) + y * Math.cos(-heading);
            //       Then compute motor powers with rotX/rotY instead of x/y.

            // Placeholder (robot-centric fallback):
            double rotX = x;
            double rotY = y;

            double fl = rotY + rotX + rx;
            double fr = rotY - rotX - rx;
            double bl = rotY - rotX + rx;
            double br = rotY + rotX - rx;

            double max = Math.max(Math.abs(fl),
                        Math.max(Math.abs(fr),
                        Math.max(Math.abs(bl), Math.abs(br))));
            if (max > 1.0) { fl /= max; fr /= max; bl /= max; br /= max; }

            frontLeft.setPower(fl);
            frontRight.setPower(fr);
            backLeft.setPower(bl);
            backRight.setPower(br);

            telemetry.addData("FL/FR", "%.2f / %.2f", fl, fr);
            telemetry.addData("BL/BR", "%.2f / %.2f", bl, br);
            telemetry.update();
        }
    }
}