const stackTrace = require(`stack-trace`)
const { codeFrameColumns } = require(`@babel/code-frame`)
const fs = require(`fs-extra`)
const path = require(`path`)
const chalk = require(`chalk`)
const { isNodeInternalModulePath } = require(`gatsby-core-utils`)

const gatsbyLocation = path.dirname(require.resolve(`gatsby/package.json`))
const reduxThunkLocation = path.dirname(
  require.resolve(`redux-thunk/package.json`)
)
const reduxLocation = path.dirname(require.resolve(`redux/package.json`))

const getNonGatsbyCallSite = () => false
// stackTrace
//   .get()
//   .find(
//     callSite =>
//       callSite &&
//       callSite.getFileName() &&
//       !callSite.getFileName().includes(gatsbyLocation) &&
//       !callSite.getFileName().includes(reduxLocation) &&
//       !callSite.getFileName().includes(reduxThunkLocation) &&
//       !isNodeInternalModulePath(callSite.getFileName())
//   )

const getNonGatsbyCodeFrame = ({ highlightCode = true } = {}) => {
  return null // Disable for development. DO NOT COMMIT

  const callSite = getNonGatsbyCallSite()
  if (!callSite) {
    return null
  }

  const fileName = callSite.getFileName()
  const line = callSite.getLineNumber()
  const column = callSite.getColumnNumber()

  const code = fs.readFileSync(fileName, { encoding: `utf-8` })
  return {
    fileName,
    line,
    column,
    codeFrame: codeFrameColumns(
      code,
      {
        start: {
          line,
          column,
        },
      },
      {
        highlightCode,
      }
    ),
  }
}

const getNonGatsbyCodeFrameFormatted = ({ highlightCode = true } = {}) => {
  return null // Disable for development. DO NOT COMMIT

  const possibleCodeFrame = getNonGatsbyCodeFrame({
    highlightCode,
  })

  if (!possibleCodeFrame) {
    return null
  }

  const { fileName, line, column, codeFrame } = possibleCodeFrame
  return `File ${chalk.bold(`${fileName}:${line}:${column}`)}\n${codeFrame}`
}

module.exports = {
  getNonGatsbyCodeFrame,
  getNonGatsbyCodeFrameFormatted,
}
