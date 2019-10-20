import { expect } from 'chai'
import { tryToDo } from '../src/tryToDo'

describe('tryToDo function', () => {

  it('any function in tryToDo decorator should return a function.', () => {
    expect(tryToDo(iDoError)).to.be.an('function')
  })

  it('any other first argument except function in tryToDo decorator should return undefined. And fire a warn to the console.', () => {
    expect(tryToDo({ a: 1 })(1)).to.eql(undefined)
  })

  it('should return success result with arguments (1) and result [1].', () => {
    expect(tryToDo(iDoSuccess)(1)).to.eql([1])
  })

})
