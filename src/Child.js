import Component from './wz'
import {render} from './render'
import compileEle from './compileEle'
// const jsx = document.createElement('div')
// jsx.textContent = 'wz'

class Child extends Component {
  ComponentWillMount () {
    // this.setState({title: 1})
    // this.setState({title: 2})
    // this.setState({title: this.state.title++})
    // console.log('will mount')
  }
  ComponentDidMount () {
    // console.log('did mount')
  }

  ComponentWillUpdate () {
    // console.log('will update')
  }

  ComponentDidUpdate () {
    // console.log('did update')
  }

  render () {
    return compileEle('div', 'child', null)
  }
}

render(document.getElementById('root'), Child)
