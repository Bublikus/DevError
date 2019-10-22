import { expect } from 'chai'
import { tryToDo } from '../src/tryToDo'

import { DevError } from '../src/DevError'
import { ResponseError } from '../src/ResponseError'
import { ValidationError } from '../src/ValidationError'

const types = [
  () => {},
  {},
  { a: 1 },
  [],
  ['qwe'],
  undefined,
  null,
  false,
  true,
  0,
  3,
  '',
  'asd',
  NaN,
  Infinity,
  new Error('message'),
  new Date(),
]

function iDoSuccess(...args) {
  return args
}

function iDoError(...args) {
  eval('ewqer / finit')
}

function iDoResponseError(status) {
  throw { status }
}

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


describe('tryToDo function', () => {

  it('any value as an argument in tryToDo decorator should return a function.', () => {
    for (let type of types) {
      expect(tryToDo(type)).to.be.an('function')
    }
  })

  it('any other first argument except function and any options in tryToDo decorator should return undefined. And fire a warn to the console.', () => {
    const newTypes = types.filter(a => typeof a !== 'function')
    for (let type of newTypes) {
      expect(tryToDo(type, type)(type)).to.eql(undefined)
    }
  })

  it('any success function must not return instance of DevError class.', () => {
    for (let type of types) {
      expect(tryToDo(iDoSuccess)(type)).to.be.not.instanceof(DevError)
    }
  })

  it('any error function must throw DevError instance with name ReferenceError.', () => {
    for (let type of types) {
      expect(tryToDo(iDoError, { noConsole: true })(type)).to.has.property('name', 'ReferenceError')
    }
  })

  it('any error function with integer number more than 0 in "status" field must return instance of ResponseError class.', () => {
    expect(tryToDo(iDoResponseError, { noConsole: true })(300)).to.be.instanceof(ResponseError)
  })

  it('any error function with valid "errorFields" object in error or in options must return instance of ValidationError class.', () => {
    expect(tryToDo(throwValidationError, { noConsole: true })()).to.be.instanceof(ValidationError)
  })

  it('any error function with integer number 0 in "status" field must return instance of DevError class.', () => {
    expect(tryToDo(iDoResponseError, { noConsole: true })(0)).to.be.instanceof(DevError)
  })

  it('any error function with integer number in response code range in "status" field must throw instance of ResponseError class.', () => {
    expect(tryToDo(() => iDoResponseError(300), {
      noConsole: true,
      throw: true,
    })).to.throw(ResponseError)
  })

  it('any error function with any argument or not in response code range "status" field must throw instance of DevError class.', () => {
    for (let type of types) {
      expect(tryToDo(iDoResponseError, {
        noConsole: true,
        throw: true,
      }), type).to.throw(DevError).with.property('status', 0)
    }
  })

})
