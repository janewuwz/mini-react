import {render} from './render'

window.tree = {}
window.temp = []

// get child component's name
function getFuncName (func) {
  const funcStr = func.toString()
  var re = /function\s(.*)\(/g
  return re.exec(funcStr)[1]
}

/**
 * @param {string<tag> | Component}
 * @param {object <attr> | <props>}
 * @param {string <text> | ... arbitrary rest child}
 * @returns {object} virtual dom
 */
export function makeElement () {
  // Exhaustion origin props
  const originAttr = ['name', 'id', 'type', 'onkeypress', 'key', 'onclick', 'className', 'placeholder']
  // child component
  if (typeof arguments[0] === 'function') {
    const funcName = getFuncName(arguments[0])
    const resetProps = {}
    if (arguments[1]) {
      // child props
      Object.entries(arguments[1]).forEach(item => {
        if (item[0] === 'key') {
          resetProps.key = item[1]
          window.temp.push(item[1])
        }
        // props attr
        if (!originAttr.includes(item[0]) && item[0] !== 'key') {
          resetProps[item[0]] = item[1]
          resetProps.displayName = funcName
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
    Object.entries(attr).forEach(item => {
        // general props
      if (originAttr.includes(item[0])) {
        // console.log(item)
        window.tree.attr.push({[item[0]]: item[1]})
      }
    })
  }
  const rest = [...arguments].slice(2)

  // textnode is string
  if (rest.length === 1 && typeof rest[0] === 'string') {
    window.tree.text = rest[0]
    return window.tree
  }
  // textnode is number
  if (rest.length === 1 && typeof rest[0] === 'number') {
    window.tree.text = rest[0]
    return window.tree
  }
  // many childnode
  if (rest.length >= 1) {
    const indexes = []
    for (var i = 0; i < rest.length; i++) {
      indexes.push(i)
    }
    rest.forEach(item => {
      if (Array.isArray(item)) {
        // map render item
        window.tree.child = item
      } else {
        if (item.key === undefined) {
          item.key = indexes.shift()
        }
        if (window.temp.length > 0) {
          window.tree.key = window.temp.pop()
        }
        window.tree.child.push(item)
      }
    })
    return window.tree
  }
  // other case I don't consider
  return window.tree
}

export class Component {
  constructor () {
    this.displayName = this.constructor.name
    this.state = {}
    this.props = {}
    this.batchedState = []
    this.batchedCb = []
    this.setState = (newState, cb) => {
      this.state = {
        ...this.state,
        ...newState
      }
      render(document.getElementById('root'), this)
    }
  }

  ComponentWillMount () {
  }
  ComponentDidMount () {
  }
  ComponentWillUpdate () {
  }
  shouldComponentUpdate () {
    return true
  }
  ComponentDidUpdate () {

  }
  ComponentWillUnMount () {

  }
  render () {}
}
