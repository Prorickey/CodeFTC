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
        // TODO: Write a switch statement on liftState.
        // IDLE case: set lift power to 0.0, if gamepad1.a then transition to RAISING.
        // RAISING case: set lift power to 1.0.

        // --- Claw FSM ---
        // TODO: Write a switch statement on clawState.
        // CLOSED case: set claw position to 0.0, if gamepad1.a then transition to OPEN.
        // OPEN case: set claw position to 1.0.

        // --- Second iteration (simulates the next loop pass) ---
        // TODO: Repeat both switch statements so the new states take effect.
    }
}