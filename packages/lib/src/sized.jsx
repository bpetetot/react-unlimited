import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UnlimitedList from './unlimited'

class UnlimitedSizedList extends Component {
  state = {
    ref: undefined,
  }

  setRef = ref => this.setState({ ref })

  render() {
    const {
      height,
      width,
      className,
      ...rest
    } = this.props

    const { ref } = this.state

    return (
      <div
        ref={this.setRef}
        className={className}
        style={{
          height,
          width,
          overflow: 'auto',
          willChange: 'scroll-position',
        }}
      >
        <UnlimitedList scrollerRef={ref} {...rest} />
      </div>
    )
  }
}

UnlimitedSizedList.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  className: PropTypes.string,
}

UnlimitedSizedList.defaultProps = {
  className: undefined,
}

export default UnlimitedSizedList
