import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range'

import './infinite.css';

class Infinite extends Component {
  state = {
    itemsWindow: [],
  }

  wrapper = React.createRef();

  componentDidMount() {
    const { current } = this.wrapper;
    let ticking = false;

    this.listener = window.addEventListener('scroll', (e) => {
      const { scrollY, clientHeight } = window;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const listTop = scrollY - current.offsetTop;
          console.log(clientHeight)
          this.renderList(listTop >= 0 ? listTop : 0);
          ticking = false;
        });
      }
      ticking = true;
    })

    this.renderList()
  }

  componentWillUnmount() {
    if (this.listener) {
      window.removeEventListener(this.listener);
    }
  }

  renderList = (top = 0) => {
    const { items, rowHeight, itemsVisible } = this.props;

    const minIndex = Math.floor(top / rowHeight);
    const maxIndex = Math.floor((top + (itemsVisible * rowHeight)) / rowHeight);

    this.setState({
      itemsWindow: items.slice(minIndex, maxIndex),
      itemsIndexes: range(minIndex, maxIndex),
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
  itemsVisible: PropTypes.number,
}

Infinite.defaultProps = {
  items: [],
  rowHeight: 0,
  itemsVisible: 10,
}

export default Infinite;