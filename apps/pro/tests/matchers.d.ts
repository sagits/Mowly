/** Types for the `toHavePathname` matcher that `expo-router/testing-library` registers at runtime but does not declare. */
declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePathname(pathname: string): R;
    }
  }
}

export {};
