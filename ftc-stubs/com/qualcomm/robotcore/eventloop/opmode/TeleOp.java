package com.qualcomm.robotcore.eventloop.opmode;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Stub for the FTC SDK @TeleOp annotation.
 * Marks an OpMode as a TeleOp (driver-controlled) program.
 *
 * <p>Usage:
 * <pre>
 *   {@literal @}TeleOp(name = "My TeleOp", group = "Tutorial")
 *   public class MyTeleOp extends LinearOpMode { ... }
 * </pre>
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TeleOp {
    /**
     * The display name of this OpMode on the Driver Station.
     * @return the OpMode name
     */
    String name() default "";

    /**
     * The group this OpMode belongs to, for organizing the Driver Station menu.
     * @return the group name
     */
    String group() default "";
}
