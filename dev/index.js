const Parser = require('../lib')

const tpl =
`<div *if="true" *for="a in data" class="className" :class="className2" style="background-color: red;"  :style="style">
  <strong :text="name+a"></strong>你好
  <!--comment!!-->
</div>
`

const parser = new Parser()
const ejml = parser.parse(tpl)

window.onload = function () {
  const tplNode = document.getElementById('tpl')
  tplNode.innerText = tpl

  const ejmlNode = document.getElementById('ejml')
  ejmlNode.innerText = JSON.stringify(ejml, null, 2)
}
