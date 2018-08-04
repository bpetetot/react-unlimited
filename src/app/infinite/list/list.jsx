import React, { Component } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range'
import cn from 'classnames';

class List extends Component {
  handleRenderRow = (index) => {
    const { renderRow, rowHeight } = this.props;
    const style = {
      position: 'absolute',
      width: '100%',
      height: `${rowHeight}px`,
      top: index * rowHeight,
      left: 0,
      boxSizing: 'border-box',
      willChange: 'top',
    }
    return renderRow({ index, style });
  }

  renderList = () => {
    const { startIndex, endIndex } = this.props;
    if (startIndex === -1 || endIndex === -1) {
      return null;
    }
    return range(startIndex, endIndex + 1).map(this.handleRenderRow)
  }

  render() {
    const { forwardedRef, height, className } = this.props

    return (
      <div
        ref={forwardedRef}
        className={cn('list', className)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: `${height}px`,
          boxSizing: 'border-box',
        }}
      >
        {this.renderList()}
      </div>
    );
  }
}

List.propTypes = {
  forwardedRef: PropTypes.any.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
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