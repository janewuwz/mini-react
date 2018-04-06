import {realRender} from './compileEl'
import cloneDeep from './utils/cloneDeep'
import diff from './diff'

let componentsPool = []

export function render (component, Node, resetProps) {
  let node = Node
  let afterRender
  let child = Node
  let childRender
  if (resetProps !== undefined) {
    const {key, displayName, ...other} = resetProps
    var oldEle = componentsPool[key] || componentsPool[displayName]
    child = oldEle || new Node()
    if (key) {
      componentsPool[key] = child
    } else {
      componentsPool[child.displayName] = child
    }
    child.props = other
    child.key = key
    if (oldEle) {
      child.ComponentWillUpdate()
    } else {
      child.ComponentWillMount()
    }
    childRender = child.render()
    if (oldEle) {
      child.ComponentDidUpdate()
    } else {
      child.ComponentDidMount()
    }
    return childRender
  }

  if (typeof Node === 'function' && resetProps === undefined) {
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
