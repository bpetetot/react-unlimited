import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { range } from '../utils'

class List extends Component {
  handleRenderRow = (index) => {
    const { renderRow, rowHeight, isScrolling } = this.props

    const style = {
      position: 'absolute',
      width: '100%',
      height: `${rowHeight}px`,
      willChange: 'transform',
      transform: `translate3d(0, ${index * rowHeight}px, 0)`,
      boxSizing: 'border-box',
    }

    return renderRow({ index, style, isScrolling })
  }

  renderList = () => {
    const { startIndex, endIndex } = this.props
    if (startIndex === -1 || endIndex === -1) {
      return null
    }
    return range(startIndex, endIndex + 1).map(this.handleRenderRow)
  }

  render() {
    const {
      forwardedRef,
      height,
      width,
      isScrolling,
      className,
    } = this.props

    return (
      <div
        ref={forwardedRef}
        className={className}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: 'auto',
          maxWidth: `${width}px`,
          height: `${height}px`,
          maxHeight: `${height}px`,
          boxSizing: 'border-box',
          pointerEvents: isScrolling ? 'none' : '',
        }}
      >
        {this.renderList()}
      </div>
    )
  }
}

List.propTypes = {
  forwardedRef: PropTypes.any.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  isScrolling: PropTypes.bool,
  className: PropTypes.string,
}

List.defaultProps = {
  isScrolling: false,
  className: undefined,
}

const ForwardRefList = (props, ref) => <List {...props} forwardedRef={ref} />

export default React.forwardRef(ForwardRefList)
