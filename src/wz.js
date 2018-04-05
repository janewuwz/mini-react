import {render} from './render'
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

/**
 * @param {string<tag> | Component}
 * @param {object <attr> | <props>}
 * @param {string <txt> | ... arbitrary rest child}
 */
export function makeElement () {
  const originAttr = ['name', 'id', 'type', 'onkeypress', 'key', 'onclick', 'className', 'placeholder']
  if (typeof arguments[0] === 'function') {
    const resetProps = {}
    // child component

    if (arguments[1]) {
      // child props
      Object.entries(arguments[1]).map(item => {
        if (item[0] === 'key') {
          resetProps.key = item[1]
          window.temp.push(item[1])
        }
        // props attr
        if (!originAttr.includes(item[0]) && item[0] !== 'key') {
          resetProps[item[0]] = item[1]
        }
      })
    }
    return render(undefined, arguments[0], resetProps)
  }

  window.tree = {}
  window.tree.type = arguments[0]
  window.tree.child = []
  window.tree.attr = []
  const attr = arguments[1]
  if (attr !== null) {
    // attr
    Object.entries(attr).map(item => {
        // 一般属性
      if (originAttr.includes(item[0])) {
        window.tree.attr.push({[item[0]]: item[1]})
      }
    })
  }
  const rest = [...arguments].slice(2)

  // textnode为字符串
  if (rest.length === 1 && typeof rest[0] === 'string') {
    window.tree.txt = rest[0]
    return window.tree
  }
  // textnode为数字
  if (rest.length === 1 && typeof rest[0] === 'number') {
    window.tree.txt = rest[0]
    return window.tree
  }
  // 多个childnode
  if (rest.length >= 1) {
    rest.forEach(item => {
      if (item !== undefined) {
        if (Array.isArray(item)) {
          window.tree.child = item
        } else {
          if (window.temp.length > 0) {
            window.tree.key = window.temp.pop()
          }
          window.tree.child.push(item)
        }
      }
    })
    return window.tree
  }
  return window.tree
}

export class Component {
  constructor () {
    this.jsx = null
    this.state = {}
    this.props = {}
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
