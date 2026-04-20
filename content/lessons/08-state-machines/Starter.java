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
        // TODO: Use a switch statement on 'state' to handle each LiftState.
        //
        // In the IDLE case:
        //   - Set liftMotor power to 0.0
        //   - If gamepad1.a is pressed, transition to RAISING
        //
        // In the RAISING case:
        //   - Set liftMotor power to 1.0
        //
        // In the HOLDING case:
        //   - Set liftMotor power to 0.1

        // --- Second FSM iteration ---
        // TODO: Copy the same switch statement here.
        // In a real program this would be inside a while(opModeIsActive()) loop.
        // The second iteration picks up the new state from the first.
    }
}