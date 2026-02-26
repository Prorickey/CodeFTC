import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Command Demo")
public class StudentCode extends LinearOpMode {

    // --- Command interface ---
    interface Command {
        void initialize();
        void execute();
        boolean isFinished();
        void end(boolean interrupted);
    }

    // --- Simple single-command scheduler ---
    static class CommandScheduler {
        private Command current = null;

        public void schedule(Command command) {
            if (current != null) {
                current.end(true);
            }
            current = command;
            current.initialize();
        }

        public void run() {
            if (current == null) return;
            current.execute();
            if (current.isFinished()) {
                current.end(false);
                current = null;
            }
        }

        public boolean isIdle() {
            return current == null;
        }
    }

    // TODO: Implement a DriveCommand class that implements Command.
    //
    // It should have:
    //   - A constructor that accepts (DcMotor motor, double power)
    //   - initialize(): set the motor to the given power
    //   - execute(): no-op (nothing to do per-tick)
    //   - isFinished(): return true immediately (one-shot command)
    //   - end(boolean interrupted): set motor power to 0.0

    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");

        waitForStart();

        CommandScheduler scheduler = new CommandScheduler();

        // TODO: Schedule a DriveCommand with power 0.75 on driveMotor, then run the scheduler once.
    }
}
