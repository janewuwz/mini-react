import {realRender} from './compileEl'
import cloneDeep from './utils/cloneDeep'
import diff from './diff'

// save components to reuse
let componentsPool = {}

// render component to target node, actually just call component's render and generate virtual dom tree or diff old one and new one
export function render (component, Node, resetProps) {
  let node = Node
  // let afterRender
  let child = Node
  let childRender
  // If restProps,means that rendering child component
  if (resetProps !== undefined) {
    const {key, displayName, ...other} = resetProps
    var oldEle = componentsPool[key] || componentsPool[displayName]
    child = oldEle || new Node() // reuse component from pool or new one
    // save component by key or name
    if (key) {
      componentsPool[key] = child
    } else {
      componentsPool[child.displayName] = child
    }
    child.props = other
    child.key = key
    if (oldEle) {
      // reuse
      child.ComponentWillUpdate()
    } else {
      child.ComponentWillMount()
    }
    childRender = child.render()
    if (oldEle) {
      // reuse
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
    node.render()
    realRender(window.tree)
    node.ComponentDidMount()
  } else {
    // update
    node.ComponentWillUpdate()
    window.prevTree = cloneDeep(window.tree)
    window.tree = {}
    node.render()
    diff(window.tree, window.prevTree)
    node.ComponentDidUpdate()
  }
}
