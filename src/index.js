import Component from './wz'
import {render} from './render'
import {compileEle, parseDomTree, diff} from './compileEle'
import domTree from './domTree'
// const jsx = document.createElement('div')
// jsx.textContent = 'wz'

class Instance extends Component {
  constructor() {
    super()
    this.state = {
      cur: undefined
    }
  }
  ComponentWillMount () {
    
    // this.setState({title: 2})
    // this.setState({title: this.state.title++})
    // console.log('will mount')
  }
  ComponentDidMount () {
    this.setState({cur: '4'})
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
    // console.log(this.state.cur)
    return diff(this.state.cur, this.click1)
    // return diff(domTree, this.click1, '4')
    // return compileEle('button', this.state.title, this.click)
  }
}

render(document.getElementById('root'), Instance)
