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

    // One-shot command: sets motor to power in initialize(), stops it in end()
    class DriveCommand implements Command {
        private DcMotor motor;
        private double power;

        DriveCommand(DcMotor motor, double power) {
            this.motor = motor;
            this.power = power;
        }

        @Override
        public void initialize() {
            motor.setPower(power);
        }

        @Override
        public void execute() {
            // Nothing to do per-tick for a one-shot command
        }

        @Override
        public boolean isFinished() {
            return true; // Finishes immediately after one scheduler tick
        }

        @Override
        public void end(boolean interrupted) {
            motor.setPower(0.0);
        }
    }

    @Override
    public void runOpMode() {
        DcMotor driveMotor = hardwareMap.get(DcMotor.class, "driveMotor");

        waitForStart();

        CommandScheduler scheduler = new CommandScheduler();
        scheduler.schedule(new DriveCommand(driveMotor, 0.75));
        scheduler.run();
    }
}
