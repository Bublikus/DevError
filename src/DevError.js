// It's fucking 3:00am and it's fucking done.

import { DevErrorObservable } from './observable'

/**
 * Default error types:
 *
 * EvalError - Raised when the eval() functions is used in an incorrect manner.
 * RangeError - Raised when a numeric variable exceeds its allowed range.
 * ReferenceError - Raised when an invalid reference is used.
 * SyntaxError - Raised when a syntax error occurs while parsing JavaScript code.
 * TypeError - Raised when the type of a variable is not as expected.
 * URIError - Raised when the encodeURI() or decodeURI() functions are used in an incorrect manner.
 */

/**
 * Custom error types:
 *
 * DevError - Base error in development.
 * Informational - Information responses.
 * Success - Successful responses.
 * Redirection - Redirection messages.
 * Client - Client error responses.
 * Server - Server error responses.
 */

// ------------------------------------======================================------------------------------------

/**
 *
 * @class DevError
 *
 * @description Core class of development error.
 *
 */
export class DevError extends Error {
  constructor(error, options) {
    const config = DevErrorService.getConfig(error, options)

    super(config.message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, DevError);
    }

    this.config = config
    this.name = config.name
    this.data = config.data
    this.error = config.error
    this.status = config.status
    this.message = config.message
    this.description = config.description
    this.created = DevErrorService.getISOTime()

    const devErrorObservable = new DevErrorObservable()
    if (typeof config.name === 'string' && config.name !== this.constructor.name) {
      devErrorObservable.notify(config, config.name)
    }
    devErrorObservable.notify(config)
  }
}

// ------------------------------------======================================------------------------------------

/**
 *
 * @class DevErrorService
 *
 * @description Service of the core class of development error.
 *
 */
export class DevErrorService {
  /**
   *
   * @description Coordinator for getting config from smaller actions.
   *
   * @param {object} error - original error.
   * @param {object} [options] - properties of the error.
   *
   * @return {object} - Enhanced config.
   *
   */
  static getConfig(error, options) {
    const config = DevErrorService.toDefaultType(options, '', {})
    config.error = error

    return {
      status: DevErrorService.getStatus(config, 0),
      name: DevErrorService.getName(config, 'DevError'),
      data: DevErrorService.toDefaultType(config, 'data', {}),
      error: DevErrorService.toDefaultType(config, 'error', {}),
      message: DevErrorService.getMessage(config, 'Sorry! Error has occurred in the app.'),
      description: DevErrorService.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
    }
  }

  /**
   *
   * @description Util for getting message from custom, error and default values.
   *
   * @param {object} options - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - New normalized message.
   *
   * @examples
   * getMessage(config) === '...blah...bla... Dev Error ...blah!'
   *
   */
  static getMessage(options, defaultVal) {
    const config = DevErrorService.toDefaultType(options, '', {})

    const appErrorMsg = DevErrorService.toDefaultType(config, 'error.message', '')
    const isNoInternet = appErrorMsg === 'Failed to fetch'

    const appErrorName = DevErrorService.toDefaultType(config, 'error.name', '')
    const errorName = config.name || appErrorName

    return (typeof config.error === 'string' && config.error)
      || config.message
      || (isNoInternet && `You have no internet connection.`)
      || (errorName && `Sorry! ${DevErrorService.addSpaces(errorName)} has occurred in the app.`)
      || defaultVal
  }

  /**
   *
   * @description Util for getting description from custom, error and default values.
   *
   * @param {object} options - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - New normalized description.
   *
   * @examples
   * getDescription(config) === '...blah...bla... Dev Error ...blah!'
   *
   */
  static getDescription(options, defaultVal) {
    const config = DevErrorService.toDefaultType(options, '', {})

    const appErrorMsg = DevErrorService.toDefaultType(config, 'error.message', '')
    const isNoInternet = appErrorMsg === 'Failed to fetch'

    return config.description
      || (isNoInternet && `Make sure you are online.`)
      || (appErrorMsg && `This feature probably does not work properly, cause of in-app error: "${appErrorMsg}".\nPlease, notify us and we'll fix it.`)
      || defaultVal
  }

  /**
   *
   * @description Util for getting name for error from custom, error and default values.
   *
   * @param {object} options - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - Custom name of an error.
   *
   * @examples
   * getName(config) === 'DevError'
   *
   */
  static getName(options, defaultVal) {
    const config = DevErrorService.toDefaultType(options, '', {})

    const appErrorMsg = DevErrorService.toDefaultType(config, 'error.message', '')
    const isNoInternet = appErrorMsg === 'Failed to fetch'

    const appErrorName = DevErrorService.toDefaultType(config, 'error.name', '')
    const errorName = config.name || appErrorName

    return (isNoInternet && 'ConnectionError')
      || errorName
      || defaultVal
  }

  /**
   *
   * @description Util for getting status of an error from custom, error and default values.
   *
   * @param {object} options - properties of the error.
   * @param {number} defaultVal - default value.
   *
   * @return {number} - status of an error. 0 - dev error.
   *
   * @examples
   * getName(config) === 200
   *
   */
  static getStatus(options, defaultVal) {
    const config = DevErrorService.toDefaultType(options, '', {})

    const appErrorStatus = DevErrorService.toDefaultType(config, 'error.status', 0)
    const errorStatus = config.status !== undefined ? config.status : appErrorStatus

    return errorStatus || defaultVal
  }

  /**
   *
   * @description Util for getting ISO time for avoiding timezones.
   *
   * @return {string} - Current UTC time in string.
   *
   * @examples
   * getISOTime() === '2019-10-17T21:55:49.365Z'
   *
   */
  static getISOTime() {
    return new Date().toISOString()
  }

  /**
   * @description Util for adding spaces between camelCases.
   *
   * @param {string} str - simple sting.
   *
   * @return {string} - Changed string with spaces.
   *
   */
  static addSpaces(str) {
    return str.replace(/([A-Z])/g, ' $1').trim()
  }

  /**
   * @description Util for typed getting property from data.
   *
   * @param {*} data - any data.
   * @param {*|string} field - name of property in the data.
   * @param {*} defaultValue - return value should have the same type and got property.
   *
   * @return {*} - Result of getting correct property from data.
   *
   */
  static toDefaultType(data, field, defaultValue) {
    field = field || ''

    if (!data || typeof field !== 'string') {
      return defaultValue
    }

    function safeGetter(obj, i) {
      try {
        return !!i ? obj[i] : obj
      } catch (e) {
        return undefined
      }
    }

    const result = field.split('.').reduce(safeGetter, data)

    return defaultValue !== undefined
      ? DevErrorService.isSameType(result, defaultValue) ? result : defaultValue
      : result
  }

  /**
   * @description Util for checking whether type of a is the same as type of b.
   *
   * @param {*} a - any data.
   * @param {*} b - any data.
   *
   * @return {boolean}
   *
   */
  static isSameType(a, b) {
    const rules = [
      (aa, bb) => typeof aa === typeof bb,
      (aa, bb) => (+aa === aa) === (+bb === bb),            // whether one is NaN
      (aa, bb) => (aa === null) === (bb === null),          // null is object type too
      (aa, bb) => Array.isArray(aa) === Array.isArray(bb),  // array is object type too
    ]
    return !rules.some(ruleFn => !ruleFn(a, b))
  }

}

// ------------------------------------======================================------------------------------------
