import chalk from "chalk"

let core
try {
  core = require("babel-core")
} catch (e) {
  core = require("@babel/core")
}

function catchBabelVersionMismatch(fn) {
  return function() {
    try {
      fn.apply(null, arguments)
    } catch (e) {
      if (
        e.message.startsWith(
          "Plugin/Preset files are not allowed to export objects"
        )
      ) {
        const { makeInstall } = require("../lingui-init")
        const install = makeInstall()
        console.log(chalk.red("Please install missing Babel 6 core package:"))
        console.log()
        console.log(install("babel-core@^6.0.0", true))
        console.log()

        process.exit(1)
      } else if (
        e.message.startsWith(
          'Requires Babel "^7.0.0-0", but was loaded with "6.26.3".'
        )
      ) {
        const { makeInstall } = require("../lingui-init")
        const install = makeInstall()
        console.log(chalk.red("Please install missing Babel 7 core packages:"))
        console.log()
        console.log(install("babel-core@^7.0.0-bridge.0 @babel/core", true))
        console.log()

        process.exit(1)
      } else {
        throw e
      }
    }
  }
}

export const transform = catchBabelVersionMismatch(core.transform)
export const transformFileSync = catchBabelVersionMismatch(
  core.transformFileSync
)
