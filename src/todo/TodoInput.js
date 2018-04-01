import {Component, makeElement} from '../wz'
import './style.css'

export default class TodoInput extends Component {
  handleKeyPress = (e) => {
    const key = e.key;
    const value = e.target.value;
    if (key === 'Enter') {
      e.target.value = '';
      this.props.onTodoItemAdded(value);
    }
  }
  render () {
    /**
     * <input type="text" onKeyPress={this.handleKeyPress} />
     */
    const {count} = this.state
    return makeElement('input', {type: 'text', onkeypress: this.handleKeyPress, className: 'input', placeholder: 'Please input todo...'}, '')
  }
}
