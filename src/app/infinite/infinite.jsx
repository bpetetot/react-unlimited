import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import List from './list';

import './infinite.css';

class Infinite extends Component {
  state = {
    itemsWindow: [],
    itemsIndexes: [],
  }

  wrapper = React.createRef();
  scrollContainer = React.createRef();

  getScrollElement = () => {
    const { scrollWindow } = this.props;
    if (scrollWindow) {
      return window
    } else {
      return this.scrollContainer.current
    }
  }

  getScrollData = () => {
    const { scrollWindow } = this.props;
    return {
      element: this.getScrollElement(),
      top: scrollWindow ? window.scrollY : this.scrollContainer.current.scrollTop,
      height: scrollWindow ? window.innerHeight : this.scrollContainer.current.clientHeight,
    }
  }

  componentDidMount() {
    const { current } = this.wrapper;
    // first render of the list
    const { element, height } = this.getScrollData();
    this.updateList(0, height - current.offsetTop)

    // render on scroll
    let ticking = false;
    this.listener = element.addEventListener('scroll', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { offsetTop } = current;
          const scrollData = this.getScrollData();
          const top = scrollData.top - offsetTop;
          this.updateList(
            top >= 0 ? top : 0,
            top >= 0 ? scrollData.height : scrollData.height - offsetTop
          );
          ticking = false;
        });
      }
      ticking = true;
    })
  }

  componentWillUnmount() {
    const { scrollElement } = this.props;
    if (this.listener) {
      scrollElement.removeEventListener('scroll', this.listener);
    }
  }

  updateList = (top = 0, height) => {
    const { items, rowHeight, overscan } = this.props;

    const minIndex = Math.floor(top / rowHeight);
    const maxIndex = Math.floor((top + height) / rowHeight);

    const minIndexOverscan = minIndex - overscan >= 0 ? minIndex - overscan : 0;
    const maxIndexOverscan = maxIndex + overscan < items.length ? maxIndex + overscan : (items.length - 1);

    this.setState({
      itemsWindow: items.slice(minIndexOverscan, maxIndexOverscan + 1),
      itemsIndexes: range(minIndexOverscan, maxIndexOverscan + 1),
    });
  }

  renderList = (className) => {
    const { items, rowHeight } = this.props;
    const { itemsWindow } = this.state;

    return (
      <List
        ref={this.wrapper}
        items={itemsWindow}
        height={rowHeight * items.length}
        renderItem={this.renderItem}
        className={className}
      />
    )
  }

  renderItem = ({ id, name }, index) => {
    const { rowHeight } = this.props;
    const { itemsIndexes } = this.state;
    const height = `${rowHeight}px`;

    return (
      <div
        key={id}
        className="infinite-list-item"
        style={{
          height,
          top: itemsIndexes[index] * rowHeight,
          left: 0,
        }}
      >
        {name}
      </div>
    )
  }

  render() {
    const { scrollWindow, className } = this.props;

    if (scrollWindow) {
      return this.renderList(className);
    }

    return (
      <div
        ref={this.scrollContainer}
        className={className}
        style={{ overflow: 'auto' }}
      >
        {this.renderList()}
      </div>
    )
  }
}

Infinite.propTypes = {
  items: PropTypes.array,
  rowHeight: PropTypes.number,
  overscan: PropTypes.number,
  scrollWindow: PropTypes.bool,
}

Infinite.defaultProps = {
  items: [],
  rowHeight: 0,
  overscan: 10,
  scrollWindow: false,
}

export default Infinite;