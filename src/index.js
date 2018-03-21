import {Component, makeElement} from './wz'
import {render} from './render'
import {compileEle, parseDomTree, diff} from './compileEle'
import domTree from './domTree'
// const jsx = document.createElement('div')
// jsx.textContent = 'wz'

class Instance extends Component {
  constructor() {
    super()
    this.state = {
      cur: 'wz'
    }
  }
  ComponentWillMount () {
    
    // this.setState({title: 2})
    // this.setState({title: this.state.title++})
    // console.log('will mount')
  }
  ComponentDidMount () {
    // this.setState({cur: '4'})
    // console.log('did mount')
  }

  ComponentWillUpdate () {
    // console.log('will update')
  }

  ComponentDidUpdate () {
    // console.log('did update')
  }

  click = () => {
    const newNum = this.state.title + 1
    this.setState({title: newNum})
  }

  click1 = () => {
    console.log('click1-3')
    this.setState({cur: '90'})
  }

  render () {
    /**
     * <div>
     *  <span><h1></h1></span>
     *  <span></span>
     * </div>
     */
    const {cur} = this.state
    var a = makeElement('div', { id: 'foo' }, makeElement('span', {name: 'bar'}, makeElement('h1', {name: 'haha'}, 'h tag')), makeElement('span', {name: 'baz'}, cur))
    
    return a
  }
}

render(document.getElementById('root'), Instance)
