import {Component, makeElement} from '../wz'

export default class TodoItem extends Component {
  handleRemoveButtonClick = () => {
    const { onTodoItemRemoved, todo } = this.props;
    // console.log(todo)
    onTodoItemRemoved(todo.id);    
  }
  handleTodoTitleClick = () => {
    const { onTodoItemToggled, todo } = this.props;
    onTodoItemToggled(todo.id);
  }
  render () {
    /**
     * <div>
     *  <div onClick={this.handleTodoTitleClick}>{title}</div>
     *  <div onClick={this.handleRemoveButtonClick}>x</div>
     * </div>
     */
    const {title, complete} = this.props.todo
    var isComplete = complete ? 'complete' : 'title'
    return makeElement('div', {className: 'item'}, makeElement('div', {onclick: this.handleTodoTitleClick, className: isComplete}, title), makeElement('span', {onclick: this.handleRemoveButtonClick, className: 'remove'}, 'x'))
  }
}
