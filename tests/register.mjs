import { registerHooks } from "node:module"

registerHooks({
  load(url, context, nextLoad) {
    return nextLoad(url, url.endsWith(".ts") ? { ...context, format: "module-typescript" } : context)
  },
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context)
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context)
      }
      throw error
    }
  },
})
