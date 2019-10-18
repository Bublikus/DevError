export * from './tryToDo'
export * from './DevError'

import { tryToDo } from './tryToDo'
import { DevError } from './DevError'

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
