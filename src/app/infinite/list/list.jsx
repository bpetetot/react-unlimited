import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range'
import cn from 'classnames';

import './list.css'

class List extends Component {
  handleRenderRow = index => {
    const { renderRow, rowHeight } = this.props;

    return (
      <div
        key={index}
        className="list-item"
        style={{
          height: `${rowHeight}px`,
          top: index * rowHeight,
          left: 0
        }}
      >
        {renderRow(index)}
      </div>
    )
  }

  render() {
    const {
      forwardedRef,
      start,
      end,
      height,
      className
    } = this.props
    return (
      <div
        ref={forwardedRef}
        className={cn('list', className)}
        style={{ height: `${height}px` }}
      >
        {range(start, end).map(this.handleRenderRow)}
      </div>
    );
  }
}

List.propTypes = {
  forwardedRef: PropTypes.any.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  className: PropTypes.string,
}

List.defaultProps = {
  height: 0,
}

const ForwardRefList = (props, ref) => {
  return <List {...props} forwardedRef={ref} />;
}

export default React.forwardRef(ForwardRefList);