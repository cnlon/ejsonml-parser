const assert = require('chai').assert
const parse = require('../lib')

const equal = assert.equal

/* global describe, it */
describe('ejsonml-parser', () => {
  const tpl =
  `
  <div class="className" style="background-color: red;"  :style="style">
    <strong :text="name+','"></strong>你好
    <!--comment!!-->
  </div>
  `
  const jml = parse(tpl)
  it('Outer tag should be div', () => {
    equal(jml[0], 'div')
  })
  it('Should have comment', () => {
    equal(jml[2][3], '<!--comment!!-->')
  })
})
