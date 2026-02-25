package org.firstinspires.ftc.robotcore.external.navigation;

/**
 * Stub for the FTC SDK DistanceUnit enum.
 * Represents units of distance measurement with conversion utilities.
 */
public enum DistanceUnit {
    CM, MM, INCH, METER;

    /**
     * Converts a distance in centimeters to this unit.
     * @param cm the distance in centimeters
     * @return the distance in this unit
     */
    public double fromCm(double cm) {
        switch (this) {
            case CM: return cm;
            case MM: return cm * 10.0;
            case INCH: return cm / 2.54;
            case METER: return cm / 100.0;
            default: return cm;
        }
    }
}
