import parse from '../src'
import jsParse from '../src/parse.javascript'
import render from './render'

window.onload = function () {
  const template =
  `
  <div class="className" style="background-color: red;"  :style="style">
    <strong :text="name+','"></strong>你好
  </div>
  `
  const tplNode = document.getElementById('tpl')
  tplNode.innerText = template

  let ejml = parse(template)
  const refNode = document.getElementById('bef')
  refNode.innerText = JSON.stringify(ejml, null, '  ')

  ejml = jsParse(template)
  const resNode = document.getElementById('res')
  resNode.innerText = JSON.stringify(ejml, null, '  ')

  const scope = {
    name: '张三',
    style: 'font-size: 48px;',
  }
  ejml = jsParse(template, true)
  let preview = render(ejml, scope)
  const pvwNode = document.getElementById('pvw')
  pvwNode.appendChild(preview)
}
