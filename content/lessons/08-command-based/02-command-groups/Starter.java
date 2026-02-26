import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;

@TeleOp(name = "Command Groups")
public class StudentCode extends LinearOpMode {

    // --- Command interface ---
    interface Command {
        void initialize();
        void execute();
        boolean isFinished();
        void end(boolean interrupted);
    }

    // --- SequentialCommandGroup: runs commands one after another ---
    static class SequentialCommandGroup implements Command {
        private java.util.List<Command> commands;
        private int index = 0;

        SequentialCommandGroup(Command... commands) {
            this.commands = java.util.Arrays.asList(commands);
        }

        @Override
        public void initialize() {
            index = 0;
            if (!commands.isEmpty()) {
                commands.get(0).initialize();
            }
        }

        @Override
        public void execute() {
            if (index >= commands.size()) return;
            Command current = commands.get(index);
            current.execute();
            if (current.isFinished()) {
                current.end(false);
                index++;
                if (index < commands.size()) {
                    commands.get(index).initialize();
                }
            }
        }

        @Override
        public boolean isFinished() {
            return index >= commands.size();
        }

        @Override
        public void end(boolean interrupted) {
            if (interrupted && index < commands.size()) {
                commands.get(index).end(true);
            }
        }
    }

    // --- Single-command scheduler ---
    static class CommandScheduler {
        private Command current = null;

        public void schedule(Command command) {
            if (current != null) current.end(true);
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

    // TODO: Implement RunOnceCommand that implements Command.
    //
    // Constructor: (DcMotor motor, double power)
    // initialize(): set motor to power
    // execute():    no-op
    // isFinished(): return true immediately
    // end(boolean interrupted): set motor power to 0.0

    @Override
    public void runOpMode() {
        DcMotor motorA = hardwareMap.get(DcMotor.class, "motorA");
        DcMotor motorB = hardwareMap.get(DcMotor.class, "motorB");

        waitForStart();

        CommandScheduler scheduler = new CommandScheduler();

        // TODO: Schedule a SequentialCommandGroup that:
        //   1. Runs motorA at 1.0 (RunOnceCommand)
        //   2. Then runs motorB at 0.5 (RunOnceCommand)
        //
        // Then call scheduler.run() twice to advance through both commands.
    }
}
