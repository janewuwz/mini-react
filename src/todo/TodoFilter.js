import {Component, makeElement} from '../wz'

export default class TodoFilter extends Component {
  getTodo = (type) => e => {
    const {getFilter} = this.props
    getFilter(type)
  }
  render () {
    const {show} = this.props
    return makeElement('div', {className: 'filter-wrapper'}, makeElement('div', {className: 'filter', onclick: this.getTodo('completed')}, 'completed'), makeElement('div', {className: 'filter', onclick: this.getTodo('active')}, 'active'), makeElement('div', {className: 'filter', onclick: this.getTodo('All')}, 'all'))
  }
}
