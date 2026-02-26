package org.firstinspires.ftc.robotcore.external;

/**
 * Stub for the FTC SDK Telemetry interface.
 * Provides methods to send data to the Driver Station for display.
 */
public interface Telemetry {

    /**
     * Adds a data item with a caption and value.
     * @param caption the label for this data item
     * @param value the value to display
     * @return an Item handle (this stub returns null)
     */
    Object addData(String caption, Object value);

    /**
     * Adds a data item with a caption and formatted string value.
     * @param caption the label for this data item
     * @param format the format string
     * @param args the format arguments
     * @return an Item handle (this stub returns null)
     */
    Object addData(String caption, String format, Object... args);

    /**
     * Adds a line of text to the telemetry.
     * @param text the text to add
     * @return a Line handle (this stub returns null)
     */
    Object addLine(String text);

    /**
     * Adds an empty line to the telemetry.
     * @return a Line handle (this stub returns null)
     */
    Object addLine();

    /**
     * Sends the accumulated telemetry data to the Driver Station.
     * @return true if the update was sent
     */
    boolean update();

    /**
     * Clears all telemetry data from the display.
     */
    void clear();

    /**
     * Clears all data items (but not lines).
     */
    void clearAll();

    /**
     * Speaks a text string through the Driver Station.
     * @param text the text to speak
     */
    void speak(String text);

    /**
     * Sets whether telemetry is automatically cleared after each update().
     * @param autoClear true to auto-clear
     */
    void setAutoClear(boolean autoClear);

    /**
     * Returns whether auto-clear is enabled.
     * @return true if auto-clear is enabled
     */
    boolean isAutoClear();
}
