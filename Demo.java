public class Demo {
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        int a = 5;
        int result = square(a);
        System.out.println("Square of " + a + " là: " + result);
    }
    static int square(int x) {
        return x * x;
    }
}
