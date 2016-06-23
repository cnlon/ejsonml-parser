const assert = require('chai').assert
const Parser = require('../lib')

const equal = assert.equal

/* global describe, it */
describe('ejsonml-parser', () => {
  const tpl =
`
<div *if="true" class="className" style="background-color: red;"  :style="style">
  <strong :text="name+','"></strong>你好
  <!--comment!!-->
</div>
`
  const parser = new Parser()
  const ejml = parser.parse(tpl)
  it('Outer tag of ejml should be template', () => {
    equal(ejml[0], 'template')
  })
})
