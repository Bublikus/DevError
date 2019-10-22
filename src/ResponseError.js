import { DevError, DevErrorService } from './DevError'

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

    const config = ResponseErrorService.getConfig(error, options)

    this.config = config
    this.name = config.name
    this.data = config.data
    this.error = config.error
    this.status = config.status
    this.message = config.message
    this.description = config.description
    this.created = this.config.created
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
   * @param {object} [options] - properties of an error.
   *
   * @return {object} - Enhanced config.
   *
   * @examples
   * getConfig(error, options) === {...}
   *
   */
  static getConfig(error, options) {
    const config = ResponseErrorService.toDefaultType(options, '', {})
    config.error = error

    const status = (config.error || {}).status
    if (status >= 100 && status < 200) {
      return ResponseErrorService.getErrorConfigFor('informational', config)
    } else if (status >= 200 && status < 300) {
      return ResponseErrorService.getErrorConfigFor('success', config)
    } else if (status >= 300 && status < 400) {
      return ResponseErrorService.getErrorConfigFor('redirection', config)
    } else if (status >= 400 && status < 500) {
      return ResponseErrorService.getErrorConfigFor('client', config)
    } else if (status >= 500 && status < 600) {
      return ResponseErrorService.getErrorConfigFor('server', config)
    } else {
      return DevErrorService.getConfig(error, config)
    }
  }

  /**
   *
   * @param {object} error - original error.
   * @param {object} [options] - properties of an error.
   *
   * @return {boolean}
   *
   * @examples
   * isResponseError(error, options) === false
   */
  static isResponseError(error, options) {
    return (options && Number.isFinite(error.status) && error.status >= 100 && error.status < 600)
      || (error && Number.isFinite(error.status) && error.status >= 100 && error.status < 600)
  }

  /**
   *
   * @param {string} type - key of subscriptions group.
   * @param {string} config - properties of an error.
   *
   * @return {object} - Enhanced config.
   *
   * @examples
   * getErrorConfigFor('informational') === {...}
   *
   */
  static getErrorConfigFor(type, config) {
    return ResponseErrorService.errorTypes(config)[type]()
  }

  /**
   *
   * @param {object} config - properties of an error.
   *
   * @description Returns object of actions by given type.
   *
   */
  static errorTypes(config) {
    return {
      informational: () => {
        return {
          ...config,
          name: ResponseErrorService.getName(config, 'Informational'),
          status: ResponseErrorService.getStatus(config, 0),
          data: ResponseErrorService.toDefaultType(config, 'data', {}),
          error: ResponseErrorService.toDefaultType(config, 'error', {}),
          message: ResponseErrorService.getMessage(config, 'Informational error has occurred in the app.'),
          description: ResponseErrorService.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      success: () =>  {
        return {
          ...config,
          name: ResponseErrorService.getName(config, 'Success'),
          status: ResponseErrorService.getStatus(config, 0),
          message: ResponseErrorService.getMessage(config, 'Great!'),
          data: ResponseErrorService.toDefaultType(config, 'data', {}),
          error: ResponseErrorService.toDefaultType(config, 'error', {}),
          description: ResponseErrorService.getDescription(config, `All data was saved!`),
        }
      },
      redirection: () =>  {
        return {
          ...config,
          name: ResponseErrorService.getName(config, 'Redirection'),
          status: ResponseErrorService.getStatus(config, 0),
          data: ResponseErrorService.toDefaultType(config, 'data', {}),
          error: ResponseErrorService.toDefaultType(config, 'error', {}),
          message: ResponseErrorService.getMessage(config, 'Oops. Redirection error has occurred in the app.'),
          description: ResponseErrorService.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      client: () =>  {
        return {
          ...config,
          name: ResponseErrorService.getName(config, 'Client'),
          status: ResponseErrorService.getStatus(config, 0),
          data: ResponseErrorService.toDefaultType(config, 'data', {}),
          error: ResponseErrorService.toDefaultType(config, 'error', {}),
          message: ResponseErrorService.getMessage(config, 'Oops. Wrong data goes from the client side.'),
          description: ResponseErrorService.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
      server: () =>  {
        return {
          ...config,
          name: ResponseErrorService.getName(config, 'Server'),
          status: ResponseErrorService.getStatus(config, 0),
          data: ResponseErrorService.toDefaultType(config, 'data', {}),
          error: ResponseErrorService.toDefaultType(config, 'error', {}),
          message: ResponseErrorService.getMessage(config, 'Oops. Wrong data goes from the server side.'),
          description: ResponseErrorService.getDescription(config, `This feature probably does not work properly. Please, notify us and we'll fix it.`),
        }
      },
    }
  }

  /**
   *
   * @param {object} options - properties of error.
   * @param {string?} options.message - custom dev message title.
   *
   * @param {string} defaultVal - default message.
   *
   * @return {string} - New normalized message
   *
   * @examples
   * getMessage(config) === '...blah...bla... Response Error ...blah!'
   *
   */
  static getMessage(options, defaultVal) {
    const config = ResponseErrorService.toDefaultType(options, '', {})
    return config.message || defaultVal
  }

}

// ------------------------------------======================================------------------------------------
