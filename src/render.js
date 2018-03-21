import {realRender} from './compileEle'

export function render (component, Node) {
  let node = Node
  let resu
  if (typeof Node === 'function') {
    node = new Node()
    node.ComponentWillMount()
    resu = node.render()
    realRender(window.tree)
    node.ComponentDidMount()
  } else {
    node.ComponentWillUpdate()
    resu = node.render()
    node.ComponentDidUpdate()
    node.ComponentWillUnMount()
  }
  console.log('render')
  if (resu && typeof resu === 'Node') {
    component.appendChild(resu)
  }
  // component.appendChild(resu)
}
