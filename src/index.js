import {Component, makeElement} from './wz'
import {render} from './render'
import Child from './Child'

class Parent extends Component {
  ComponentWillMount () {
    console.log('Parent will mount')
  }
  ComponentDidMount () {
    console.log('Parent did mount')
    this.setState({})
  }
  ComponentWillUpdate () {
    console.log('parent will upadte')
  }
  ComponentDidUpdate () {
    console.log('parent did update')
  }
  render () {
    /**
     * <div id='content'>
     *  <div>I'm parent</div>
     *  <div>I'm Child</div>
     * </div>
     */
    console.log('parent render')
    return makeElement('div', { id: 'content' }, makeElement('div', {}, "I'm parent"), makeElement(Child, {}, ''))
  }
}

render(document.getElementById('root'), Parent)
