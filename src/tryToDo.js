import { DevError } from './DevError'

/**
 *
 * @function tryToDo
 *
 * @description Decorator above unstable function for catching readable messages for a user.
 *
 * @param {function} doFn - trying to call a function.
 *
 * @param {object} options - additional options for error.
 * @param {boolean} [options.throw] - for throwing error.
 * @param {boolean} [options.noConsole] - for hiding console warnings.
 *
 * @throws {object} - enhanced error with information.
 * @return {object} - enhanced error with information.
 *
 * @example
 * const tryToGetTable = tryToDo(function getTable(...args) {
 *   eval('nruter wen ved rorre / finity')
 * })(...args) - throws new DevError
 * @example
 * const tryToGetTable = tryToDo((...args) => {
 *   letconst x = get:x-of-point
 *   letconst y = get:y-of-point
 * }, {
 *  message: "Sorry for dev error :("
 * })(...args) - throws new DevError
 * @example
 * const tryToGetTable = tryToDo(get)('/get/table') - throws new DevError
 * if (tryToGetTable instanceof DevError) return ':('
 *
 */
export const tryToDo = (doFn, options) => (...args) => {
  if (typeof doFn !== 'function') {
    console.warn('The tryToDo decorator should take a function as the first argument.')
    return
  }

  const config = typeof options === 'object' && !Array.isArray(options) && !!options ? options : {}

  try {
    return doFn(...args)
  } catch (e) {
    const error = new DevError(e)

    if (!config.noConsole) {
      console.warn(error)
    }

    if (config.throw) {
      throw error
    } else {
      return error
    }
  }
}
