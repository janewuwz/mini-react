import {Component, makeElement} from '../wz'

export default class TodoItem extends Component {
  handleRemoveButtonClick = () => {
    const { onTodoItemRemoved, id } = this.props;
    onTodoItemRemoved(id);    
  }
  handleTodoTitleClick = () => {
    const { onTodoItemToggled, id } = this.props;
    onTodoItemToggled(id);
  }
  render () {
    /**
     * <div>
     *  <div onClick={this.handleTodoTitleClick}>{title}</div>
     *  <div onClick={this.handleRemoveButtonClick}>x</div>
     * </div>
     */
    const {count} = this.state
    const {title, complete} = this.props

    return makeElement('div', {}, makeElement('div', {onclick: this.handleTodoTitleClick}, this.state.title), makeElement('div', {onclick: this.handleRemoveButtonClick}, 'x'))
  }
}
