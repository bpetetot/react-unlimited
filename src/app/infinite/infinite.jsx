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
      scrollTop: scrollWindow ? window.scrollY : this.scrollContainer.current.scrollTop,
      scrollHeight: scrollWindow ? window.innerHeight : this.scrollContainer.current.clientHeight,
    }
  }

  scrollTo = (index) => {
    const { scrollWindow, rowHeight } = this.props;
    const { current } = this.wrapper;
    const { scrollHeight } = this.getScrollData();

    const top = index * rowHeight;
    this.updateList(top, scrollHeight - current.offsetTop);

    if (scrollWindow) {
      return window.scrollTo({ top }); // FIXME doesnt work when updating
    } else {
      return this.scrollContainer.current.scrollTop = top;
    }
  }

  componentDidMount() {
    // first render of the list
    this.scrollTo(this.props.scrollToIndex || 0);

    // render on scroll
    const { current } = this.wrapper;
    let ticking = false;
    this.listener = this.getScrollElement().addEventListener('scroll', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollHeight } = this.getScrollData();
          const top = scrollTop - current.offsetTop;
          this.updateList(
            top >= 0 ? top : 0,
            top >= 0 ? scrollHeight : scrollHeight - current.offsetTop
          );
          ticking = false;
        });
      }
      ticking = true;
    })
  }

  componentDidUpdate(prevProps) {
    const { scrollToIndex } = this.props;
    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollTo(scrollToIndex);
    }
  }

  componentWillUnmount() {
    if (this.listener) {
      this.getScrollElement().removeEventListener('scroll', this.listener);
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
    const top = itemsIndexes[index] * rowHeight;
    return (
      <div
        key={id}
        className="infinite-list-item"
        style={{ height, top, left: 0 }}
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
  scrollToIndex: PropTypes.number,
}

Infinite.defaultProps = {
  items: [],
  rowHeight: 0,
  overscan: 10,
  scrollWindow: false,
  scrollToIndex: 0,
}

export default Infinite;