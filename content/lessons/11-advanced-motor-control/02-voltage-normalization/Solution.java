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

        VoltageSensor voltageSensor = hardwareMap.voltageSensor.iterator().next();

        waitForStart();

        double voltage         = voltageSensor.getVoltage();
        double scale           = NOMINAL_VOLTAGE / voltage;
        double normalizedPower = TARGET_POWER * scale;
        normalizedPower        = Math.max(-1.0, Math.min(1.0, normalizedPower));

        motor.setPower(normalizedPower);
    }
}
