import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from './list';

class Infinite extends Component {
  state = {
    startIndex: 0,
    endIndex: 0,
  }

  wrapper = React.createRef();
  scroller = React.createRef();

  getScroller = () => {
    const { scrollWindow } = this.props;
    const { current } = this.scroller;

    return scrollWindow ? window : current;
  }

  getScrollerData = () => {
    const { scrollWindow } = this.props;
    const { current } = this.scroller;

    return {
      scrollTop: scrollWindow ? window.scrollY : current.scrollTop,
      scrollHeight: scrollWindow ? window.innerHeight : current.clientHeight,
    }
  }

  getIndexPosition = (index) => {
    const { scrollWindow, rowHeight, length } = this.props;
    const { current } = this.wrapper;

    const offsetTop = scrollWindow ? current.offsetTop : 0;

    if (index < 0) {
      return offsetTop;
    } else if (index >= length) {
      return ((length - 1) * rowHeight) + offsetTop;
    } else {
      return (index * rowHeight) + offsetTop;
    }
  }

  scrollToIndex = (index) => {
    const { scrollWindow } = this.props;

    const top = this.getIndexPosition(index);

    if (scrollWindow) {
      setTimeout(() => window.scrollTo(0, top));
    } else {
      this.scroller.current.scrollTop = top;
    }
  }

  scrollListener =  () => {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const { scrollTop } = this.getScrollerData();
        this.updateListFromPosition(scrollTop);
        this.ticking = false;
      });
    }
    this.ticking = true;
  }

  componentDidMount() {
    const { scrollToIndex } = this.props;

    this.ticking = false;
    this.getScroller().addEventListener('scroll', this.scrollListener);

    this.updateListFromIndex(scrollToIndex || 0);
    if (scrollToIndex) {
      this.scrollToIndex(scrollToIndex);
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollToIndex } = this.props;
    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollToIndex(scrollToIndex);
    }
  }

  componentWillUnmount() {
    this.getScroller().removeEventListener('scroll', this.scrollListener);
  }

  updateListFromIndex = (index) => {
    const { length, rowHeight, overscan } = this.props;
    const { scrollHeight } = this.getScrollerData();

    const max = index + Math.floor(scrollHeight / rowHeight);

    this.setState({
      startIndex: index - overscan >= 0 ? index - overscan : 0,
      endIndex: max + overscan < length ? max + overscan : (length - 1)
    });
  }

  updateListFromPosition = (scrollTop = 0) => {
    const { scrollWindow, rowHeight } = this.props;
    const { current } = this.wrapper;

    const top = scrollWindow ? scrollTop - current.offsetTop : scrollTop;
    const index = Math.floor(top / rowHeight);

    this.updateListFromIndex(index);
  }

  renderList = (className) => {
    const { length, renderRow, rowHeight } = this.props;
    const { startIndex, endIndex } = this.state;

    return (
      <List
        ref={this.wrapper}
        startIndex={startIndex}
        endIndex={endIndex}
        height={rowHeight * length}
        rowHeight={rowHeight}
        renderRow={renderRow}
        className={className}
      />
    )
  }

  render() {
    const { scrollWindow, className } = this.props;

    if (scrollWindow) {
      return this.renderList(className);
    }

    return (
      <div
        ref={this.scroller}
        className={className}
        style={{ overflow: 'auto' }}
      >
        {this.renderList()}
      </div>
    )
  }
}

Infinite.propTypes = {
  length: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  overscan: PropTypes.number,
  scrollWindow: PropTypes.bool,
  scrollToIndex: PropTypes.number,
}

Infinite.defaultProps = {
  length: 0,
  rowHeight: 0,
  overscan: 10,
  scrollWindow: false,
  scrollToIndex: 0,
}

export default Infinite;