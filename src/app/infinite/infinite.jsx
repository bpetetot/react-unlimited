import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from './list';

class Infinite extends Component {
  state = {
    startIndex: -1,
    endIndex: -1,
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
    if (!this.scrollTicking) {
      window.requestAnimationFrame(() => {
        this.updateList();
        this.scrollTicking = false;
      });
    }
    this.scrollTicking = true;
  }

  resizeListener = () => {
    if (!this.resizeTicking) {
      window.requestAnimationFrame(() => {
        this.updateList();
        this.resizeTicking = false;
      });
    }
    this.resizeTicking = true;
  }

  componentDidMount() {
    const { scrollToIndex } = this.props;

    this.scrollTicking = false;
    this.getScroller().addEventListener('scroll', this.scrollListener);

    this.resizeTicking = false;
    window.addEventListener('resize', this.resizeListener);

    if (scrollToIndex) {
      this.scrollToIndex(scrollToIndex);
    } else {
      this.updateList();
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollToIndex, length } = this.props;
    if (length !== prevProps.length) {
      this.updateList();
    }
    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollToIndex(scrollToIndex);
    }
  }

  componentWillUnmount() {
    this.getScroller().removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.resizeListener);
  }

  updateList = () => {
    const {
      length,
      overscan,
      scrollWindow,
      rowHeight,
      onLoadMore,
    } = this.props;

    const { current } = this.wrapper;
    const { scrollTop, scrollHeight } = this.getScrollerData();

    const top = scrollWindow ? scrollTop - current.offsetTop : scrollTop;

    const start = Math.floor(top / rowHeight);
    const end = start + Math.floor(scrollHeight / rowHeight);

    if (onLoadMore && end + overscan >= length) {
      onLoadMore();
    }

    this.setState({
      startIndex: start - overscan >= 0 ? start - overscan : 0,
      endIndex: end + overscan < length ? end + overscan : (length - 1)
    });
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
        style={{
          overflow: 'auto',
          willChange: 'scroll-position',
        }}
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
  onLoadMore: PropTypes.func,
}

Infinite.defaultProps = {
  length: 0,
  rowHeight: 0,
  overscan: 10,
  scrollWindow: false,
  scrollToIndex: undefined,
}

export default Infinite;