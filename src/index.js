export * from './tryToDo'
export * from './DevError'
export * from './ResponseError'
export * from './ValidationError'

import { tryToDo } from './tryToDo'
import { DevError } from './DevError'
import { ValidationError } from './ValidationError'

/**
 * @examples
 */

function getData(variable) {
  variable / constant
}

const tryToGetData = tryToDo(getData, { noConsole: true })()
if (tryToGetData instanceof DevError) {
  console.log('name: ', tryToGetData.name)
  console.log('status: ', tryToGetData.status)
  console.log('message: ', tryToGetData.message)
  console.log('description: ', tryToGetData.description)
}

console.log('------------------------------======================================------------------------------')

function throwStatus() {
  throw {
    status: 300,
  }
}

const tryToGetFetch = tryToDo(throwStatus, { noConsole: true })()
if (tryToGetFetch instanceof DevError) {
  console.log('name: ', tryToGetFetch.name)
  console.log('status: ', tryToGetFetch.status)
  console.log('message: ', tryToGetFetch.message)
  console.log('description: ', tryToGetFetch.description)
}

console.log('------------------------------======================================------------------------------')

function throwValidationError() {
  throw {
    errorFields: {
      'name': 'Error in field name',
      'message': ['Error in field message', 'Message is required'],
      'phone': { a: 1 },
      'form': ['Error in field form', { b: 2 }, 'Form is required', null, ''],
    }
  }
}

const tryToGetForm = tryToDo(throwValidationError, { noConsole: true })()
if (tryToGetForm instanceof ValidationError) {
  console.log('name: ', tryToGetForm.name)
  console.log('status: ', tryToGetForm.status)
  console.log('message: ', tryToGetForm.message)
  console.log('description: ', tryToGetForm.description)
  console.log('errorFields: ', tryToGetForm.errorFields)
}

console.log('------------------------------======================================------------------------------')

function throwObj() {
  throw {}
}

const tryToGetFormWithOptions = tryToDo(throwObj, { noConsole: true, errorFields: {
    'name': 'Error in field name',
    'message': ['Error in field message', 'Message is required'],
    'phone': { a: 1 },
    'form': ['Error in field form', { b: 2 }, 'Form is required', null, ''],
  } }
)()

if (tryToGetFormWithOptions instanceof ValidationError) {
  console.log('name: ', tryToGetFormWithOptions.name)
  console.log('status: ', tryToGetFormWithOptions.status)
  console.log('message: ', tryToGetFormWithOptions.message)
  console.log('description: ', tryToGetFormWithOptions.description)
  console.log('errorFields: ', tryToGetFormWithOptions.errorFields)
}
