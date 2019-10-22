import { DevError, DevErrorService } from './DevError'

// ------------------------------------======================================------------------------------------

/**
 *
 * @class ValidationError
 *
 * @description Core class of form validation error.
 *
 */
export class ValidationError extends DevError {
  constructor(error, options) {
    super(error, options)

    const config = ValidationErrorService.getConfig(error, options)

    this.config = config
    this.name = config.name
    this.data = config.data
    this.error = config.error
    this.status = config.status
    this.message = config.message
    this.description = config.description
    this.errorFields = config.errorFields
    this.created = this.config.created
  }
}

// ------------------------------------======================================------------------------------------

/**
 *
 * @class ValidationErrorService
 *
 * @description Service of the core class of form Validation error.
 *
 */
export class ValidationErrorService extends DevErrorService {
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
    const config = ValidationErrorService.toDefaultType(options, '', {})
    config.error = error

    const isValidationError = ValidationErrorService.isValidationError(error, config)
    if (isValidationError) {
      return ValidationErrorService.getValidationErrorConfig(error, config)
    } else {
      return DevErrorService.getConfig(config)
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
   * isValidationError(error, options) === false
   */
  static isValidationError(error, options) {
    const optionsErrorFields = ValidationErrorService.toDefaultType(options, 'errorFields', {})
    const errorFields = ValidationErrorService.toDefaultType(error, 'errorFields', {})

    return ValidationErrorService.isValidErrorFields(optionsErrorFields)
      || ValidationErrorService.isValidErrorFields(errorFields)
  }

  /**
   *
   * @param {object} errorFields - object of error fields.
   *
   * @return {boolean}
   *
   * @examples
   * isValidErrorFields(errorFields) === false
   */
  static isValidErrorFields(errorFields) {
    const safeErrorFields = ValidationErrorService.toDefaultType(errorFields, '', {})
    const errorFieldsEntries = Object.entries(safeErrorFields)

    return !errorFieldsEntries.length ? false : errorFieldsEntries
      .filter(([, val]) => {
        return (Array.isArray(val) && !!val.filter(v => !!v && typeof v == 'string').length)
          || (!!val && typeof val === 'string')
      })
      .some(([, val]) => (Array.isArray(val) && val.length) || typeof val === 'string')
  }

  /**
   *
   * @param {object} error - original error.
   * @param {object} [options] - properties of an error.
   *
   * @return {object} - Enhanced config.
   *
   * @examples
   * getValidationErrorConfig(error, options) === {...}
   *
   */
  static getValidationErrorConfig(error, options) {
    const config = ValidationErrorService.toDefaultType(options, '', {})
    config.error = error

    return {
      ...config,
      errorFields: ValidationErrorService.getErrorFields(config),
      name: ValidationErrorService.getName(config, 'ValidationError'),
      status: ValidationErrorService.getStatus(config, 0),
      data: ValidationErrorService.toDefaultType(config, 'data', {}),
      error: ValidationErrorService.toDefaultType(config, 'error', {}),
      message: ValidationErrorService.getMessage(config, 'Oops. Wrong form data.'),
      description: ValidationErrorService.getDescription(config, `Provide correct form data to invalid fields, please.`),
    }
  }

  /**
   *
   * @param {object} options - properties of an error.
   *
   * @return {object} - Error fields (field label: errors)
   *
   * @examples
   * getErrorFields(options) === {...}
   *
   */
  static getErrorFields(options) {
    const optionsErrorFields = ValidationErrorService.toDefaultType(options, 'errorFields', {})
    const errorFields = ValidationErrorService.toDefaultType(options, 'error.errorFields', {})

    return ValidationErrorService.getErrorField(optionsErrorFields)
      || ValidationErrorService.getErrorField(errorFields)
      || {}
  }

  /**
   *
   * @param {object} errorFields - object of error fields.
   *
   * @return {object} - Error fields (field label: errors)
   *
   * @examples
   * getErrorField(errorFields) === {...}
   *
   */
  static getErrorField(errorFields) {
    const safeErrorFields = ValidationErrorService.toDefaultType(errorFields, '', {})
    const errorFieldsEntries = Object.entries(safeErrorFields)

    return !errorFieldsEntries.length ? undefined : errorFieldsEntries
      .filter(([, val]) => {
        return (Array.isArray(val) && !!val.filter(v => !!v && typeof v === 'string').length)
          || (!!val && typeof val === 'string')
      })
      .reduce((acc, val) => {
        acc[val[0]] = [].concat(val[1]).filter(v => !!v && typeof v === 'string')
        return acc
      }, {})
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
    const config = ValidationErrorService.toDefaultType(options, '', {})
    return config.message || defaultVal
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
    const errorFields = ValidationErrorService.getErrorFields(options)
    const isErrorFieldsValid = ValidationErrorService.isValidErrorFields(errorFields)

    const errorFieldsMessage = !isErrorFieldsValid ? '' : Object.entries(errorFields)
      .map(([field, errors]) => `${field}:\n\t${errors.join('\n\t')}`)
      .join('\n')

    return isErrorFieldsValid
      ? `Provide correct data to next invalid fields, please:\n${errorFieldsMessage}`
      : defaultVal
  }

}

// ------------------------------------======================================------------------------------------
