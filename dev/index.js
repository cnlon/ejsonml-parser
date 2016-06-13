const Parser = require('../lib')

const tpl =
`
<div *if="true" class="className" style="background-color: red;"  :style="style">
  <strong :text="name+','"></strong>你好
  <!--comment!!-->
</div>
`
const parser = new Parser(tpl)
const ejml = parser.ejml
const hjson = parser.parse()
const hjs = parser.parse(true)

window.onload = function () {
  const tplNode = document.getElementById('tpl')
  tplNode.innerText = tpl

  const ejmlNode = document.getElementById('jml')
  ejmlNode.innerText = JSON.stringify(ejml, null, 2)

  const hjsonNode = document.getElementById('hjson')
  hjsonNode.innerText = JSON.stringify(hjson, null, 2)

  const hjsNode = document.getElementById('hjs')
  hjsNode.innerText = JSON.stringify(hjs, null, 2)
}
