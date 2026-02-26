import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode;
import com.qualcomm.robotcore.eventloop.opmode.TeleOp;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.VoltageSensor;

@TeleOp(name = "Voltage Normalization")
public class StudentCode extends LinearOpMode {

    static final double NOMINAL_VOLTAGE = 12.0;
    static final double TARGET_POWER    = 0.7;

    @Override
    public void runOpMode() {
        DcMotor motor = hardwareMap.get(DcMotor.class, "motor");

        // TODO: Get the voltage sensor from the hardware map
        //       Use: hardwareMap.voltageSensor.iterator().next()

        waitForStart();

        // TODO: Read the current battery voltage
        // TODO: Compute the scale factor: NOMINAL_VOLTAGE / voltage
        // TODO: Multiply TARGET_POWER by the scale factor
        // TODO: Clamp the result to [-1.0, 1.0]
        // TODO: Set motor power to the normalized value
    }
}
