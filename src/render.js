import {realRender} from './compileEle'
import * as _ from 'lodash'
import diff from './diff'

// export function
let child
export function render (component, Node, resetProps) {
  let node = Node
  let resu

  if (component === undefined) {
    // child component
    if (child === undefined) {
      child = new Node()
      if (resetProps) {
        child.props = {...resetProps}
      }
      child.ComponentWillMount()
      child.render()
      child.ComponentDidMount()
    } else {
      child.ComponentWillUpdate()
      child.render()
      child.ComponentDidUpdate()
    }

    return
  }
  if (typeof Node === 'function') {
    // init mount
    node = new Node()
    node.ComponentWillMount()
    resu = node.render()
    realRender(window.tree)
    node.ComponentDidMount()
  } else {
    // update
    node.ComponentWillUpdate()
    window.prevTree = _.cloneDeep(window.tree)
    window.tree = {}
    window.temp = []
    resu = node.render()
    diff(window.tree, window.prevTree)
    node.ComponentDidUpdate()
    node.ComponentWillUnMount()
  }
  if (resu && typeof resu === 'Node') {
    component.appendChild(resu)
  }
  // component.appendChild(resu)
}
