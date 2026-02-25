import java.util.ArrayList;
import java.util.List;

/**
 * Helper base class for all lesson Test.java files.
 * Accumulates test results and prints the JSON output expected by the grader.
 *
 * Usage:
 *   TestBase.assertNear("Motor power ≈ 0.8", motor.getPower(), 0.8, 0.01);
 *   TestBase.assertContains("Telemetry shows heading", log, "Heading");
 *   TestBase.printResults();
 */
public class TestBase {

    private static final List<String> results = new ArrayList<>();
    private static boolean allPassed = true;

    /** Core assertion — all others delegate here. */
    public static void check(String name, boolean condition, String passMsg, String failMsg) {
        String msg = condition ? passMsg : failMsg;
        results.add("{\"name\":\"" + esc(name) + "\",\"passed\":" + condition
                + ",\"message\":\"" + esc(msg) + "\"}");
        if (!condition) allPassed = false;
    }

    /** Assert two doubles are within tolerance of each other. */
    public static void assertNear(String name, double actual, double expected, double tol) {
        boolean ok = Math.abs(actual - expected) <= tol;
        check(name, ok,
                String.format("%.4f ≈ %.4f", actual, expected),
                String.format("Expected %.4f (±%.4f) but got %.4f", expected, tol, actual));
    }

    /** Assert two strings are equal. */
    public static void assertEqual(String name, String actual, String expected) {
        check(name, expected.equals(actual),
                "Got \"" + actual + "\"",
                "Expected \"" + expected + "\" but got \"" + actual + "\"");
    }

    /** Assert a boolean condition. */
    public static void assertTrue(String name, boolean cond, String failMsg) {
        check(name, cond, name, failMsg);
    }

    /** Assert a telemetry/call log contains the given substring. */
    public static void assertContains(String name, List<String> log, String sub) {
        boolean ok = log.stream().anyMatch(s -> s.contains(sub));
        check(name, ok,
                "Found \"" + sub + "\" in output",
                "Expected \"" + sub + "\" in output but it was missing");
    }

    /** Print the final JSON result to stdout (call exactly once, at the end of main). */
    public static void printResults() {
        StringBuilder json = new StringBuilder();
        json.append("{\"success\":").append(allPassed);
        json.append(",\"testResults\":[");
        for (int i = 0; i < results.size(); i++) {
            if (i > 0) json.append(",");
            json.append(results.get(i));
        }
        json.append("]}");
        System.out.println(json);
    }

    private static String esc(String s) {
        if (s == null) return "null";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
