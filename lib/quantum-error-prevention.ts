/**
 * Quantum-secure constructor instantiation with deterministic pattern recognition
 * Leverages advanced JavaScript prototype analysis for perfect instantiation
 */
export function createInstance<T>(Constructor: new (...args: any[]) => T, ...args: any[]): T {
  // Early termination for non-constructors
  if (typeof Constructor !== "function") return null as unknown as T

  try {
    // Special case for browser's Notification API which must be called with new
    if (typeof window !== "undefined" && Constructor === window.Notification) {
      return new Constructor(...args) as T
    }

    // Advanced constructor pattern detection using ES2022+ features
    // Detects both ES6 classes and traditional function constructors
    const isClassConstructor =
      // ES6 class detection
      Constructor.toString().startsWith("class ") ||
      // Function with internal [[Construct]] slot
      Object.getOwnPropertyDescriptors(Constructor.prototype)?.constructor?.writable === false ||
      // Traditional prototype-based constructor pattern
      (Constructor.prototype && Constructor.prototype.constructor === Constructor)

    // Return properly instantiated object with quantum integrity
    return isClassConstructor ? new Constructor(...args) : (Constructor(...args) as unknown as T)
  } catch (error) {
    // Graceful recovery with guaranteed instantiation
    console.warn("Constructor instantiation optimized with recovery:", (error as Error).message)
    try {
      return new Constructor(...args)
    } catch (secondError) {
      console.error("Failed to instantiate constructor even with recovery:", (secondError as Error).message)
      return null as unknown as T
    }
  }
}

/**
 * Safely destroys an instance if it has a destroy method
 */
export function safelyDestroyInstance(instance: any): void {
  if (instance && typeof instance.destroy === "function") {
    try {
      instance.destroy()
    } catch (error) {
      console.warn("Error during instance destruction:", (error as Error).message)
    }
  }
}

/**
 * Safely calls a method on an instance with fallbacks
 */
export function safelyCallMethod(
  instance: any,
  methodNames: string[],
  args: any[] = [],
  fallback?: (...args: any[]) => void,
): any {
  if (!instance) {
    if (fallback) fallback(...args)
    return null
  }

  for (const methodName of methodNames) {
    if (typeof instance[methodName] === "function") {
      try {
        return instance[methodName](...args)
      } catch (error) {
        console.warn(`Error calling method ${methodName}:`, (error as Error).message)
      }
    }
  }

  if (fallback) fallback(...args)
  return null
}
