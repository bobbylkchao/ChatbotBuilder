// Use vm sandbox to enhance security
import { NodeVM } from 'vm2'
import logger from '../../../misc/logger'

export const functionalHandler = (
  handlerFunctionBase64: string,
  context: any = {}
) => {
  try {
    const decodedFunction = Buffer.from(
      handlerFunctionBase64,
      'base64'
    ).toString('utf-8')
    const vm = new NodeVM({
      sandbox: context,
      timeout: 60000, // TODO: how many ms is appropriate?
    })
    return vm.run(`
      module.exports = async function runIntentHandler() {
        ${decodedFunction}
      }
    `)
  } catch (err) {
    logger.error('Encountered an error in functionalHandler')
    throw err
  }
}
