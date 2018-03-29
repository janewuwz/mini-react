import {render} from './render'
import uuid from 'node-uuid'
// function updateState (self) {
//   return new Promise((resolve, reject) => {
//     self.batchedState.forEach(element => {
//       self.state = {
//         ...self.state,
//         ...element
//       }
//     })
//     render(document.getElementById('root'), self)
//   })
// }

window.tree = {}
window.temp = []
export function makeElement () {
  // if (typeof arguments[0] === 'function') {
  //   // child component
  //   render(undefined, arguments[0])
  //   return
  // } else {
  //   window.tree[vid].type = arguments[0]
  // }

  if (typeof arguments[0] === 'function') {
    // child component
    render(undefined, arguments[0])
    return
  }
  const vid = uuid.v4()
  window.tree[vid] = {}
  window.tree[vid].type = arguments[0]
  window.tree[vid].child = []
  window.tree[vid].attr = []
  window.temp.push({[vid]: window.tree[vid]})
  const attr = arguments[1]
  if (attr !== null) {
    Object.entries(attr).map(item => {
      window.tree[vid].attr.push({[item[0]]: item[1]})
    })
  }
  const rest = [...arguments].slice(2)
  if (rest.length === 1 && typeof rest[0] !== 'string' && typeof rest[0] !== 'number') {
    const l = window.temp.shift()
    const key = Object.keys(l)[0]
    delete window.tree[key]
    l[key].parent = vid
    window.tree[vid] && window.tree[vid].child.push(l)
  }
  // textnode为字符串
  if (rest.length === 1 && typeof rest[0] === 'string') {
    window.tree[vid].txt = rest[0]
  }
  // textnode为数字
  if (rest.length === 1 && typeof rest[0] === 'number') {
    window.tree[vid].txt = rest[0]
  }
  // 多个childnode
  if (rest.length > 1) {
    const nn = window.temp.slice(0, window.temp.length - 1)
    nn.forEach(item => {
      const k = Object.keys(item)[0]
      delete window.tree[k]
      item[k].parent = vid
      window.tree[vid] && window.tree[vid].child.push(item)
    })
  }
  // if (window.tree[vid].type === undefined) {
  //   window.tree[vid].type = 'div'
  // }

  return window.tree[vid]
}

window.prevTree = {}

export class Component {
  constructor () {
    this.jsx = null
    this.state = {}
    this.batchedState = []
    this.batchedCb = []
    this.setState = (newState, cb) => {
      // window.prevTree = {...window.}
      // this.batchedState.push(newState)
      // this.batched.forEach(item => {
      //   this.state = {
      //     ...this.state,
      //     ...item.newState
      //   }
      //   item.cb && item.cb()
      //   render(document.getElementById('root'), this)
      // })
      this.state = {
        ...this.state,
        ...newState
      }
      render(document.getElementById('root'), this)
      // updateState(this).then(cb && cb())
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
