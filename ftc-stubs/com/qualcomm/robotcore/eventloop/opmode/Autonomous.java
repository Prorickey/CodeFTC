package com.qualcomm.robotcore.eventloop.opmode;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Stub for the FTC SDK @Autonomous annotation.
 * Marks an OpMode as an Autonomous program.
 *
 * <p>Usage:
 * <pre>
 *   {@literal @}Autonomous(name = "My Auto", group = "Tutorial")
 *   public class MyAuto extends LinearOpMode { ... }
 * </pre>
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Autonomous {
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
