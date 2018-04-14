/** @jsx makeElement */
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
    const {title, complete} = this.props.todo
    var isComplete = complete ? 'complete' : 'title'
    return <div className="item">
      <div onclick={this.handleTodoTitleClick} className={isComplete}>{title}
      </div>
      <span onclick={this.handleRemoveButtonClick} className="remove">X</span>
    </div>
  }
}
