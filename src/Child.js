import {Component, makeElement} from './wz'

class Child extends Component {
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
     * <div id='child'>
     *  <div>I'm Child</div>
     * </div>
     */
    return makeElement('div', { id: 'child' }, "I'm Child")
  }
}

export default Child
