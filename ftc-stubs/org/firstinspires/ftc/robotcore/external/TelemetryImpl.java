package org.firstinspires.ftc.robotcore.external;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Mock implementation of Telemetry that stores all data for test assertions.
 *
 * <p>Usage in tests:
 * <pre>
 *   TelemetryImpl telemetry = new TelemetryImpl();
 *   telemetry.addData("Speed", 0.75);
 *   telemetry.update();
 *   assert telemetry.getLog().contains("Speed: 0.75");
 * </pre>
 */
public class TelemetryImpl implements Telemetry {

    /** Ordered log of all telemetry entries (data items, lines, and actions). */
    private final List<String> log = new ArrayList<>();

    /** Currently buffered data items before the next update(). */
    private final List<String> currentItems = new ArrayList<>();

    /** Spoken text entries. */
    private final List<String> spokenText = new ArrayList<>();

    private boolean autoClear = true;
    private int updateCount = 0;

    public TelemetryImpl() {
        // Default constructor
    }

    @Override
    public Object addData(String caption, Object value) {
        String entry = caption + ": " + value;
        currentItems.add(entry);
        log.add(entry);
        return null;
    }

    @Override
    public Object addData(String caption, String format, Object... args) {
        String formatted = String.format(format, args);
        String entry = caption + ": " + formatted;
        currentItems.add(entry);
        log.add(entry);
        return null;
    }

    @Override
    public Object addLine(String text) {
        currentItems.add(text);
        log.add(text);
        return null;
    }

    @Override
    public Object addLine() {
        currentItems.add("");
        log.add("");
        return null;
    }

    @Override
    public boolean update() {
        updateCount++;
        log.add("[update #" + updateCount + "]");
        if (autoClear) {
            currentItems.clear();
        }
        return true;
    }

    @Override
    public void clear() {
        currentItems.clear();
        log.add("[clear]");
    }

    @Override
    public void clearAll() {
        currentItems.clear();
        log.add("[clearAll]");
    }

    @Override
    public void speak(String text) {
        spokenText.add(text);
        log.add("[speak] " + text);
    }

    @Override
    public void speak(String text, String languageCode, String countryCode) {
        spokenText.add(text);
        log.add("[speak:" + languageCode + "-" + countryCode + "] " + text);
    }

    @Override
    public void setAutoClear(boolean autoClear) {
        this.autoClear = autoClear;
        log.add("[setAutoClear(" + autoClear + ")]");
    }

    @Override
    public boolean isAutoClear() {
        return autoClear;
    }

    // --- Test helper methods ---

    /**
     * Returns an unmodifiable view of the complete telemetry log.
     * Includes all addData/addLine entries plus markers for update/clear operations.
     * @return list of all telemetry log entries
     */
    public List<String> getLog() {
        return Collections.unmodifiableList(new ArrayList<>(log));
    }

    /**
     * Returns the current items buffered since the last update.
     * @return list of current buffered items
     */
    public List<String> getCurrentItems() {
        return Collections.unmodifiableList(new ArrayList<>(currentItems));
    }

    /**
     * Returns all text that was passed to speak().
     * @return list of spoken text strings
     */
    public List<String> getSpokenText() {
        return Collections.unmodifiableList(new ArrayList<>(spokenText));
    }

    /**
     * Returns the number of times update() has been called.
     * @return the update count
     */
    public int getUpdateCount() {
        return updateCount;
    }

    /**
     * Clears the entire log and resets the update count.
     * Useful between test cases.
     */
    public void resetLog() {
        log.clear();
        currentItems.clear();
        spokenText.clear();
        updateCount = 0;
    }
}
