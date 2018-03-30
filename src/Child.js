import {Component, makeElement} from './wz'

class Child extends Component {
  constructor () {
    super()
    console.log('child constructor')
  }
  ComponentWillMount () {
    console.log('child will mount')
  }
  ComponentDidMount () {
    console.log('child did mount')
  }

  ComponentWillUpdate () {
    console.log('child will update')
  }

  ComponentDidUpdate () {
    console.log('child did update')
  }

  render () {
    console.log('child render')
    /**
     *
     *  <div id='child'>I'm Child</div>
     *
     */
    return makeElement('div', { id: 'child' }, this.props.content)
  }
}

export default Child
