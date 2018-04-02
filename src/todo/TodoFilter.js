import {Component, makeElement} from '../wz'

export default class TodoFilter extends Component {
  getTodo = (type) => e => {
    const {getFilter} = this.props
    getFilter(type)
  }
  render () {
    
    return makeElement('div', {className: 'filter-wrapper'}, makeElement('div', {className: 'filter', onclick: this.getTodo('Completed')}, 'Completed'), makeElement('div', {className: 'filter', onclick: this.getTodo('Active')}, 'Active'), makeElement('div', {className: 'filter', onclick: this.getTodo('All')}, 'All'))
  }
}
