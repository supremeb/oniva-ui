// Node module hook: lets plain `node` load the library's extensionless TS imports (`./shapes` -> `./shapes.ts`).
// Used by icon-sheet.mjs together with Node's built-in type stripping.
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (!specifier.startsWith('.') || /\.[cm]?[jt]sx?$/.test(specifier)) throw err;
    for (const ext of ['.ts', '/index.ts']) {
      try {
        return await next(specifier + ext, context);
      } catch {
        // try the next candidate
      }
    }
    throw err;
  }
}
