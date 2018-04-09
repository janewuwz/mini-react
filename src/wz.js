import {render} from './render'

window.temp = []
export let context = {}

export function updateContext (newContext) {
  if (newContext !== null) {
    context = newContext
    return
  }
  context = {}
}

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

  context = {}
  context.type = arguments[0]
  context.child = []
  context.attr = []
  const attr = arguments[1]
  if (attr !== null) {
    // attr
    Object.entries(attr).forEach(item => {
        // general props
      if (originAttr.includes(item[0])) {
        // console.log(item)
        context.attr.push({[item[0]]: item[1]})
      }
    })
  }
  const rest = [...arguments].slice(2)

  // textnode is string
  if (rest.length === 1 && typeof rest[0] === 'string') {
    context.text = rest[0]
    return context
  }
  // textnode is number
  if (rest.length === 1 && typeof rest[0] === 'number') {
    context.text = rest[0]
    return context
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
        context.child = item
      } else {
        if (item.key === undefined) {
          item.key = indexes.shift()
        }
        if (window.temp.length > 0) {
          context.key = window.temp.pop()
        }
        context.child.push(item)
      }
    })
    return context
  }
  // other case I don't consider
  return context
}

export class Component {
  constructor () {
    this.displayName = this.constructor.name
    this.context = context
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
    // this.render = function () {
    //   console.log('ren')
    // }
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
