/* CheerpJ 3.0 runtime API — loaded from CDN at runtime */

interface CheerpJInitOptions {
  status?: "none" | "splash" | "default"
  preloadResources?: Record<string, string>
}

declare function cheerpjInit(options?: CheerpJInitOptions): Promise<void>

declare function cheerpjRunMain(
  className: string,
  classPath: string,
  ...args: string[]
): Promise<number>

// CheerpJ 2.x name (still works with deprecation warning)
declare function cheerpjAddStringFile(
  path: string,
  data: Uint8Array | string
): void

// CheerpJ 3.0 preferred name
declare function cheerpOSAddStringFile(
  path: string,
  data: Uint8Array | string
): void

declare function cheerpjCreateDisplay(
  width: number,
  height: number,
  container: HTMLElement
): HTMLElement
