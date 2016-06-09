import parse from '../src'

const tpl =
`
<div class="className" style="background-color: red;"  :style="style">
  <strong :text="name+','"></strong>你好
  <!--comment!!-->
</div>
`
const jml = parse(tpl)

window.onload = function () {
  const tplNode = document.getElementById('tpl')
  tplNode.innerText = tpl

  const resNode = document.getElementById('res')
  resNode.innerText = JSON.stringify(jml, null, '  ')
}
