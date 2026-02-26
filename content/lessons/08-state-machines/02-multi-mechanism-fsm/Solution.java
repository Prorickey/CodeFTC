import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.Servo;

@TeleOp(name = "Multi-Mechanism FSM")
public class StudentCode extends LinearOpMode {

    enum LiftState {
        IDLE,
        RAISING
    }

    enum ClawState {
        CLOSED,
        OPEN
    }

    @Override
    public void runOpMode() {
        DcMotor liftMotor = hardwareMap.get(DcMotor.class, "liftMotor");
        Servo clawServo = hardwareMap.get(Servo.class, "clawServo");

        LiftState liftState = LiftState.IDLE;
        ClawState clawState = ClawState.CLOSED;

        waitForStart();

        // --- Lift FSM ---
        switch (liftState) {
            case IDLE:
                liftMotor.setPower(0.0);
                if (gamepad1.a) {
                    liftState = LiftState.RAISING;
                }
                break;
            case RAISING:
                liftMotor.setPower(1.0);
                break;
        }

        // --- Claw FSM ---
        switch (clawState) {
            case CLOSED:
                clawServo.setPosition(0.0);
                if (gamepad1.a) {
                    clawState = ClawState.OPEN;
                }
                break;
            case OPEN:
                clawServo.setPosition(1.0);
                break;
        }

        // --- Second iteration (simulates the next loop pass) ---
        switch (liftState) {
            case IDLE:
                liftMotor.setPower(0.0);
                if (gamepad1.a) {
                    liftState = LiftState.RAISING;
                }
                break;
            case RAISING:
                liftMotor.setPower(1.0);
                break;
        }

        switch (clawState) {
            case CLOSED:
                clawServo.setPosition(0.0);
                if (gamepad1.a) {
                    clawState = ClawState.OPEN;
                }
                break;
            case OPEN:
                clawServo.setPosition(1.0);
                break;
        }
    }
}