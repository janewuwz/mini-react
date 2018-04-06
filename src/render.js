import {realRender} from './compileEl'
import cloneDeep from './utils/cloneDeep'
import diff from './diff'

function getFuncName (func) {
  var funcStr = func.toString()
}

export function render (component, Node, resetProps) {
  let node = Node
  let afterRender
  if (resetProps !== undefined) {
    getFuncName(Node)
    // child component
    let child = Node
    child = new Node()
    const {key, ...other} = resetProps
    child.props = other
    child.key = key
    child.ComponentWillMount()
    let aa = child.render()
    child.ComponentDidMount()
    child.ComponentWillUpdate()
    child.render()
    child.ComponentDidUpdate()

    return aa
  }
  // if (component === undefined) {
  //   // child component
  //   let child = Node
  //   child = new Node()

  //   if (resetProps) {
  //     const {key, ...other} = resetProps
  //     child.props = other
  //     child.key = key
  //   }
  //   child.ComponentWillMount()
  //   let aa = child.render()
  //   child.ComponentDidMount()
  //   child.ComponentWillUpdate()
  //   child.render()
  //   child.ComponentDidUpdate()

  //   return aa
  // }
  if (typeof Node === 'function') {
    // init mount
    node = new Node()
    node.ComponentWillMount()
    afterRender = node.render()
    realRender(window.tree)
    node.ComponentDidMount()
  } else {
    // update
    node.ComponentWillUpdate()
    window.prevTree = cloneDeep(window.tree)
    window.tree = {}
    afterRender = node.render()
    diff(window.tree, window.prevTree)
    node.ComponentDidUpdate()
    node.ComponentWillUnMount()
  }
  if (afterRender && typeof afterRender === 'Node') {
    component.appendChild(afterRender)
  }
}
