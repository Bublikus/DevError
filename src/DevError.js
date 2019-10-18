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
    const devErrorService = new DevErrorService()
    const devErrorObservable = new DevErrorObservable()
    const responseErrorService = new ResponseErrorService()

    let config = typeof options === 'object' && !Array.isArray(options) && !!options ? options : {}
    config.error = error
    const status = (config.error || {}).status

    if (status > 0) {
      config = responseErrorService.getConfig(error, options)
    } else {
      config = devErrorService.getConfig(config)
    }

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
    this.created = devErrorService.getISOTime()
    this.kind = devErrorService.addSpaces(config.name)

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
   * @param {object} config - properties of the error.
   *
   * @return {object} - Enhanced config.
   *
   */
  getConfig(config) {
    return {
      status: this.getStatus(config, 0),
      name: this.getName(config, 'DevError'),
      message: this.getMessage(config, 'Sorry! Error has occurred in the app.'),
      description: this.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
    }
  }

  /**
   *
   * @description Util for getting message from custom, error and default values.
   *
   * @param {object} config - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - New normalized message.
   *
   * @examples
   * getMessage(config) === '...blah...bla... Dev Error ...blah!'
   *
   */
  getMessage(config, defaultVal) {
    const isNoInternet = (config.error || {}).message === 'Failed to fetch'
    const errorName = config.name || (config.error || {}).name
    return (typeof config.error === 'string' && config.error)
      || config.message
      || (isNoInternet && `You have no internet connection.`)
      || (errorName && `Sorry! ${this.addSpaces(errorName)} has occurred in the app.`)
      || defaultVal
  }

  /**
   *
   * @description Util for getting description from custom, error and default values.
   *
   * @param {object} config - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - New normalized description.
   *
   * @examples
   * getDescription(config) === '...blah...bla... Dev Error ...blah!'
   *
   */
  getDescription(config, defaultVal) {
    const appErrorMsg = (config.error || {}).message
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
   * @param {object} config - properties of the error.
   * @param {string} defaultVal - default value.
   *
   * @return {string} - Custom name of an error.
   *
   * @examples
   * getName(config) === 'DevError'
   *
   */
  getName(config, defaultVal) {
    const appErrorMsg = (config.error || {}).message
    const isNoInternet = appErrorMsg === 'Failed to fetch'
    return config.name
      || (isNoInternet && 'ConnectionError')
      || (config.error || {}).name
      || defaultVal
  }

  /**
   *
   * @description Util for getting status of an error from custom, error and default values.
   *
   * @param {object} config - properties of the error.
   * @param {number} defaultVal - default value.
   *
   * @return {number} - status of an error. 0 - dev error.
   *
   * @examples
   * getName(config) === 200
   *
   */
  getStatus(config, defaultVal) {
    return config.status
      || (config.error || {}).status
      || defaultVal
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
  getISOTime() {
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
  addSpaces(str) {
    return str.replace(/([A-Z])/g, ' $1').trim()
  }
}

// ------------------------------------======================================------------------------------------

/**
 *
 * @class ResponseError
 *
 * @description Core class of Response error.
 *
 */
export class ResponseError extends DevError {
  constructor(error, options) {
    super(error, options)

    const responseErrorService = new ResponseErrorService()
    const config = responseErrorService.getConfig(error, options)

    this.name = config.name
    this.data = config.data
    this.error = config.error
    this.status = config.status
    this.message = config.message
    this.description = config.description
    this.created = this.config.created
    this.kind = responseErrorService.addSpaces(config.name)
  }
}

// ------------------------------------======================================------------------------------------

/**
 *
 * @class ResponseErrorService
 *
 * @description Service of the core class of Response error.
 *
 */
export class ResponseErrorService extends DevErrorService {
  /**
   *
   * @param {object} error - original error.
   * @param {object} options - properties of an error.
   *
   * @return {object} - Enhanced config.
   *
   * @examples
   * getConfig(config) === {...}
   *
   */
  getConfig(error, options) {
    let config = typeof options === 'object' && !Array.isArray(options) && !!options ? options : {}
    config.error = error
    this.config = config
    const status = (config.error || {}).status

    if (status > 0 && status < 200) {
      return this.getErrorConfigFor('informational')
    } else if (status >= 200 && status < 300) {
      return this.getErrorConfigFor('success')
    } else if (status >= 300 && status < 400) {
      return this.getErrorConfigFor('redirection')
    } else if (status >= 400 && status < 500) {
      return this.getErrorConfigFor('client')
    } else if (status >= 500) {
      return this.getErrorConfigFor('server')
    } else {
      return new DevErrorService().getConfig(config)
    }
  }

  /**
   *
   * @param {string} type - key of subscriptions group.
   *
   * @return {object} - Enhanced config.
   *
   * @examples
   * getErrorConfigFor('informational') === {...}
   *
   */
  getErrorConfigFor(type) {
    return this.errorTypes(this.config)[type]()
  }

  /**
   *
   * @param {object} config - properties of an error.
   *
   * @description Returns object of actions by given type.
   *
   */
  errorTypes(config) {
    return {
      informational: () => {
        return {
          ...config,
          name: this.getName(config, 'Informational'),
          status: this.getStatus(config, 0),
          message: this.getMessage(config, 'Informational error has occurred in the app.'),
          description: this.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      success: () =>  {
        return {
          ...config,
          name: this.getName(config, 'Success'),
          status: this.getStatus(config, 0),
          message: this.getMessage(config, 'Great!'),
          description: this.getDescription(config, `All data was saved!`),
        }
      },
      redirection: () =>  {
        return {
          ...config,
          name: this.getName(config, 'Redirection'),
          status: this.getStatus(config, 0),
          message: this.getMessage(config, 'Oops. Redirection error has occurred in the app.'),
          description: this.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      client: () =>  {
        return {
          ...config,
          name: this.getName(config, 'Client'),
          status: this.getStatus(config, 0),
          message: this.getMessage(config, 'Oops. Wrong data goes from the client side.'),
          description: this.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      server: () =>  {
        return {
          ...config,
          name: this.getName(config, 'Server'),
          status: this.getStatus(config, 0),
          message: this.getMessage(config, 'Oops. Wrong data goes from the server side.'),
          description: this.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
    }
  }

  /**
   *
   * @param {object} config - properties of error.
   * @param {object|string} config.error - original error.
   * @param {string?} config.message - custom dev message title.
   *
   * @param {string} defaultVal - default message.
   *
   * @return {string} - New normalized message
   *
   * @examples
   * getMessage(config) === '...blah...bla... Response Error ...blah!'
   *
   */
  getMessage(config, defaultVal) {
    return (typeof config.error === 'string' && config.error)
      || config.message
      || defaultVal
  }
}

// ------------------------------------======================================------------------------------------
