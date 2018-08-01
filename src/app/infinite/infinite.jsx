import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range'

import './infinite.css';

class Infinite extends Component {
  state = {
    itemsWindow: [],
    itemsIndexes: [],
  }

  wrapper = React.createRef();

  componentDidMount() {
    const { current } = this.wrapper;
    let ticking = false;

    this.listener = window.addEventListener('scroll', (e) => {
      const { scrollY, innerHeight } = window;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const listTop = scrollY - current.offsetTop;
          this.renderList(
            listTop >= 0 ? listTop : 0,
            listTop >= 0 ? innerHeight : innerHeight - current.offsetTop // if not window on scroll then clientHeight of element
          );
          ticking = false;
        });
      }
      ticking = true;
    })

    this.renderList(0, window.innerHeight - current.offsetTop) // if not window on scroll then clientHeight of element
  }

  componentWillUnmount() {
    if (this.listener) {
      window.removeEventListener(this.listener);
    }
  }

  renderList = (top = 0, height) => {
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
    const { items, rowHeight } = this.props;
    const { itemsWindow } = this.state;

    const height = `${rowHeight * items.length}px`;

    return (
      <div
        ref={this.wrapper}
        className="infinite-wrapper"
        style={{ height }}
      >
        {itemsWindow.map(this.renderItem)}
      </div>
    );
  }
}

Infinite.propTypes = {
  items: PropTypes.array,
  rowHeight: PropTypes.number,
  overscan: PropTypes.number,
}

Infinite.defaultProps = {
  items: [],
  rowHeight: 0,
  overscan: 10,
}

export default Infinite;