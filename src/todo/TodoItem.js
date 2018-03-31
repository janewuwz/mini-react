import {Component, makeElement} from '../wz'

export default class TodoItem extends Component {
  handleRemoveButtonClick = () => {
    const { onTodoItemRemoved, todo } = this.props;
    // console.log(todo)
    onTodoItemRemoved(todo.id);    
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
    const {title, complete} = this.props.todo

    return makeElement('div', {}, makeElement('div', {onclick: this.handleTodoTitleClick}, title), makeElement('div', {onclick: this.handleRemoveButtonClick}, 'x'))
  }
}
