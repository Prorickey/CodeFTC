import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Lift FSM")
public class StudentCode extends LinearOpMode {

    enum LiftState {
        IDLE,
        RAISING,
        HOLDING
    }

    @Override
    public void runOpMode() {
        DcMotor liftMotor = hardwareMap.get(DcMotor.class, "liftMotor");
        LiftState state = LiftState.IDLE;

        waitForStart();

        // --- First FSM iteration ---
        switch (state) {
            case IDLE:
                liftMotor.setPower(0.0);
                if (gamepad1.a) {
                    state = LiftState.RAISING;
                }
                break;
            case RAISING:
                liftMotor.setPower(1.0);
                break;
            case HOLDING:
                liftMotor.setPower(0.1);
                break;
        }

        // --- Second FSM iteration ---
        switch (state) {
            case IDLE:
                liftMotor.setPower(0.0);
                if (gamepad1.a) {
                    state = LiftState.RAISING;
                }
                break;
            case RAISING:
                liftMotor.setPower(1.0);
                break;
            case HOLDING:
                liftMotor.setPower(0.1);
                break;
        }
    }
}