import com.qualcomm.robotcore.eventloop.opmode.LinearOpMode
import com.qualcomm.robotcore.eventloop.opmode.TeleOp

@TeleOp(name = "Hello OpMode")
class StudentCode : LinearOpMode() {
    override fun runOpMode() {
        telemetry.addData("Message", "Hello, FTC!")
        telemetry.update()

        waitForStart()

        telemetry.addData("Status", "Running")
        telemetry.update()
    }
}
