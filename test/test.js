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
  const parser = new Parser(tpl)
  const ejml = parser.ejml[0]
  const hjson = parser.parse()
  it('Outer tag of ejml should be *', () => {
    equal(ejml[0], '*')
  })
  it('Outer tag of hjson should has a function attribute \'*if\'', () => {
    equal(hjson[1]['*if'].slice(0, 9), 'function(')
  })
})
