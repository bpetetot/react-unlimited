import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from './list';

class Infinite extends Component {
  state = {
    startIndex: 0,
    endIndex: 0,
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
    const { scrollWindow, rowHeight, length } = this.props;
    const { current } = this.wrapper;
    const { scrollHeight } = this.getScrollData();

    let top;
    if (index < 0) {
      top = index * rowHeight;
    } else if (index >= length) {
      top = (length - 1) * rowHeight;
    } else {
      top = index * rowHeight;
    }

    this.updateList(top, scrollHeight - current.offsetTop);

    if (scrollWindow) {
      return window.scrollTo({ top }); // FIXME doesnt work when updating
    } else {
      return this.scrollContainer.current.scrollTop = top;
    }
  }

  handleScroll =  (e) => {
    const { current } = this.wrapper;
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const { scrollTop, scrollHeight } = this.getScrollData();
        const top = scrollTop - current.offsetTop;
        this.updateList(
          top >= 0 ? top : 0,
          top >= 0 ? scrollHeight : scrollHeight - current.offsetTop
        );
        this.ticking = false;
      });
    }
    this.ticking = true;
  }

  componentDidMount() {
    // first render of the list
    this.scrollTo(this.props.scrollToIndex || 0);

    // render on scroll
    this.ticking = false;
    this.listener = this.getScrollElement().addEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate(prevProps) {
    const { scrollToIndex } = this.props;
    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollTo(scrollToIndex);
    }
  }

  componentWillUnmount() {
    this.getScrollElement().removeEventListener('scroll', this.handleScroll);
  }

  updateList = (top = 0, height) => {
    const { length, rowHeight, overscan } = this.props;

    const min = Math.floor(top / rowHeight);
    const max = Math.floor((top + height) / rowHeight);

    const startIndex = min - overscan >= 0 ? min - overscan : 0;
    const endIndex = max + overscan < length ? max + overscan : (length - 1);

    this.setState({ startIndex, endIndex });
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