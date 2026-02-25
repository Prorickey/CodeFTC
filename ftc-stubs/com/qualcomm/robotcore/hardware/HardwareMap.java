package com.qualcomm.robotcore.hardware;

import java.util.HashMap;
import java.util.Map;

/**
 * Stub for the FTC SDK HardwareMap class.
 * Provides typed access to hardware devices by name, backed by a simple HashMap.
 *
 * <p>Usage in tests:
 * <pre>
 *   HardwareMap hwMap = new HardwareMap();
 *   DcMotorImpl motor = new DcMotorImpl();
 *   hwMap.registerDevice("leftMotor", motor);
 *
 *   DcMotor retrieved = hwMap.get(DcMotor.class, "leftMotor");
 *   // retrieved == motor
 * </pre>
 */
public class HardwareMap {

    /** Internal storage mapping device names to device objects. */
    private final Map<String, Object> deviceMap = new HashMap<>();

    public HardwareMap() {
        // Default constructor
    }

    /**
     * Retrieves a hardware device by type and name.
     *
     * @param <T> the device type
     * @param classOrInterface the class or interface of the device
     * @param deviceName the name of the device as configured in the robot configuration
     * @return the device cast to the requested type
     * @throws IllegalArgumentException if no device is found with the given name
     * @throws ClassCastException if the device cannot be cast to the requested type
     */
    @SuppressWarnings("unchecked")
    public <T> T get(Class<? extends T> classOrInterface, String deviceName) {
        Object device = deviceMap.get(deviceName);
        if (device == null) {
            throw new IllegalArgumentException(
                "Unable to find a hardware device with name \"" + deviceName + "\" " +
                "and type " + classOrInterface.getSimpleName() + ". " +
                "Has the device been registered with hardwareMap.registerDevice()?"
            );
        }
        if (!classOrInterface.isInstance(device)) {
            throw new ClassCastException(
                "Device \"" + deviceName + "\" is of type " +
                device.getClass().getSimpleName() + ", not " +
                classOrInterface.getSimpleName()
            );
        }
        return (T) device;
    }

    /**
     * Registers a hardware device with a name.
     * This is a test helper not present in the real FTC SDK.
     *
     * @param deviceName the name to register the device under
     * @param device the device object
     */
    public void registerDevice(String deviceName, Object device) {
        deviceMap.put(deviceName, device);
    }

    /**
     * Returns true if a device with the given name has been registered.
     *
     * @param deviceName the device name to check
     * @return true if a device is registered under that name
     */
    public boolean contains(String deviceName) {
        return deviceMap.containsKey(deviceName);
    }

    /**
     * Returns the number of registered devices.
     *
     * @return the number of devices
     */
    public int size() {
        return deviceMap.size();
    }

    /**
     * Removes all registered devices.
     * Useful between test cases.
     */
    public void clear() {
        deviceMap.clear();
    }
}
