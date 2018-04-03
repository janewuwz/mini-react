import {realRender} from './compileEle'
import cloneDeep from './utils/cloneDeep'
import diff from './diff'

// export function
let child
export function render (component, Node, resetProps) {
  let node = Node
  let resu

  if (component === undefined) {
    // child component
    child = new Node()
    if (resetProps) {
      const {key, ...other} = resetProps
      child.props = other
      child.key = key
    }
    child.ComponentWillMount()
    let aa = child.render()
    child.ComponentDidMount()
    // if (child === undefined) {
    //   child = new Node()
    //   if (resetProps) {
    //     child.props = {...resetProps}
    //   }
    //   child.ComponentWillMount()
    //   child.render()
    //   child.ComponentDidMount()
    // } else {
    //   child.ComponentWillUpdate()
    //   child.render()
    //   child.ComponentDidUpdate()
    // }

    return aa
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
    window.prevTree = cloneDeep(window.tree)
    window.tree = {}
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
