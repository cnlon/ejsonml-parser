var assert = require('chai').assert
var parse = require('../dist/ejsonml.parser.js')

var equal = assert.equal

/* global describe, it */
describe('ejsonml-parser', function () {
  const tpl =
  `
  <div class="className" style="background-color: red;"  :style="style">
    <strong :text="name+','"></strong>你好
    <!--comment!!-->
  </div>
  `
  const jml = parse(tpl)
  it('Outer tag should be div', function () {
    equal(jml[0], 'div')
  })
  it('Should have comment', function () {
    equal(jml[2][3], '<!--comment!!-->')
  })
})
