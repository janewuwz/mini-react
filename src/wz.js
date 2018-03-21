import {render} from './render'
import uuid from 'node-uuid'

function updateState (self) {
  return new Promise((resolve, reject) => {
    self.batchedState.forEach(element => {
      self.state = {
        ...self.state,
        ...element
      }
    })
    render(document.getElementById('root'), self)
  })
}
const root = document.getElementById('root')
let parents = [root]
let childs = []
let tree = {}
window.tree = tree
var a = 0
let temp = []
export function makeElement () {
  a++
  if (a === 4) {
    console.log(tree)
  }
  const vid = uuid.v4()
  tree[vid] = {}
  tree[vid].type = arguments[0]
  tree[vid].child = []
  tree[vid].attr = []
  temp.push({[vid]: tree[vid]})
  const attr = arguments[1]
  if (attr !== null) {
    Object.entries(attr).map(item => {
      tree[vid].attr.push({[item[0]]: item[1]})
    })
  }
  const rest = [...arguments].slice(2)
  if (rest.length === 1 && typeof rest[0] !== 'string') {
    const l = temp.shift()
    const key = Object.keys(l)[0]
    delete tree[key]
    l[key].parent = vid
    tree[vid] && tree[vid].child.push(l)
  }
  if (rest.length > 1) {
    const nn = temp.slice(0, temp.length - 1)
    nn.forEach(item => {
      const k = Object.keys(item)[0]
      delete tree[k]
      item[k].parent = vid
      tree[vid] && tree[vid].child.push(item)
    })
  }
  return tree[vid]

  // if (other.length === 1 && typeof other[0] !== 'function') {
  //   tree[vid].
  // }
}

// export function makeElement () {
//   const type = arguments[0]
//   const dom = document.createElement(type)
//   if (childs.length > 0) {
//     dom.appendChild(childs.pop())
//   }
//   const attr = arguments[1]
//   if (attr !== null) {
//     Object.entries(attr).map(item => {
//       console.log(typeof item[1])
//       if (typeof item[1] === 'function') {
//         dom[item[0]] = item[1]
//       } else {
//         dom.setAttribute(item[0], item[1])
//       }
//     })
//   }
//   childs.push(dom)
//   const other = [...arguments].slice(2)
//   if (other.length === 1 && typeof other[0] === 'string') {
//     const text = document.createTextNode(other[0])
//     dom.appendChild(text)
//   }
//   if (other.length > 1 && other[0] !== 'string') {
//     other.map(item => {
//       dom.appendChild(item)
//       parents.push(dom)
//     })
//   }
//   if (type) {
//     return dom
//   }
// }

// export function makeElement (type, attr, ...args) {
//   const content = args[0]
//   return parse(content, type, attr)
// }

function parse (content, type, attr) {
  const dom = document.createElement(type)
  if (childs.length > 0) {
    dom.appendChild(childs.pop())
  }
  if (attr !== null) {
    Object.entries(attr).map(item => {
      dom[item[0]] = item[1]
    })
  }
  childs.push(dom)
  if (typeof content === 'string') {
    const text = document.createTextNode(content)
    dom.appendChild(text)
  } else {
    parents.push(dom)
  }

  return dom
}

export class Component {
  constructor () {
    this.jsx = null
    this.state = {}
    this.batchedState = []
    this.batchedCb = []
    this.setState = (newState, cb) => {
      this.batchedState.push(newState)
      // this.batched.forEach(item => {
      //   this.state = {
      //     ...this.state,
      //     ...item.newState
      //   }
      //   item.cb && item.cb()
      //   render(document.getElementById('root'), this)
      // })
      // this.state = {
      //   ...this.state,
      //   ...newState
      // }
      // render(document.getElementById('root'), this)
      updateState(this).then(cb && cb())
    }
  }
  ComponentWillMount () {

  }
  ComponentDidMount () {

  }
  ComponentWillUpdate () {
  }
  ComponentDidUpdate () {

  }
  ComponentWillUnMount () {

  }
  render () {
  }
}
