import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.hardware.rev.RevHubOrientationOnRobot;
import org.firstinspires.ftc.robotcore.external.navigation.AngleUnit;
import com.qualcomm.robotcore.hardware.IMU;

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

        IMU imu = hardwareMap.get(IMU.class, "imu");
        IMU.Parameters params = new IMU.Parameters(
            new RevHubOrientationOnRobot(
                RevHubOrientationOnRobot.LogoFacingDirection.UP,
                RevHubOrientationOnRobot.UsbFacingDirection.FORWARD));
        imu.initialize(params);

        waitForStart();
        imu.resetYaw();

        while (opModeIsActive()) {
            double y  = -gamepad1.left_stick_y;
            double x  =  gamepad1.left_stick_x;
            double rx =  gamepad1.right_stick_x;

            double heading = imu.getRobotYawPitchRollAngles().getYaw(AngleUnit.RADIANS);

            double rotX = x * Math.cos(-heading) - y * Math.sin(-heading);
            double rotY = x * Math.sin(-heading) + y * Math.cos(-heading);

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

            telemetry.addData("Heading (deg)", Math.toDegrees(heading));
            telemetry.addData("FL/FR", "%.2f / %.2f", fl, fr);
            telemetry.addData("BL/BR", "%.2f / %.2f", bl, br);
            telemetry.update();
        }
    }
}