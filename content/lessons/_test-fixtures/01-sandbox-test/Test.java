public class Test {
    public static void main(String[] args) throws Exception {
        StudentCode sc = new StudentCode();
        TestBase.assertEqual("Returns correct greeting", sc.getGreeting(), "Hello, FTC!");
        TestBase.printResults();
    }
}
