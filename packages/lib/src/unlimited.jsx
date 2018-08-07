import React, { Component } from 'react'
import PropTypes from 'prop-types'

import List from './list'

class Unlimited extends Component {
  wrapper = React.createRef();

  scroller = React.createRef();

  state = {
    startIndex: -1,
    endIndex: -1,
  }

  componentDidMount() {
    const { scrollToIndex } = this.props

    if (this.isValidScroller()) {
      this.addListeners()

      if (scrollToIndex) {
        this.scrollToIndex(scrollToIndex)
      } else {
        this.updateList()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollToIndex, length } = this.props

    if (this.isValidScroller()) {
      if (this.getScroller() !== this.getScroller(prevProps)) {
        this.removeListeners(prevProps)
        this.addListeners()
      }

      if (length !== prevProps.length) {
        this.updateList()
      }

      if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
        this.scrollToIndex(scrollToIndex)
      }
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  getScroller = (props = this.props) => {
    const { scrollerRef } = props

    if (scrollerRef) return scrollerRef
    return this.scroller.current
  }

  getScrollingData = () => {
    const scroller = this.getScroller()
    const { current } = this.wrapper

    if (this.isWindowScroll()) {
      return {
        wrapperTop: current.offsetTop,
        scrollTop: scroller.scrollY,
        scrollHeight: scroller.innerHeight,
      }
    }
    return {
      wrapperTop: current.offsetTop - scroller.offsetTop,
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.clientHeight,
    }
  }

  getIndexPosition = (index) => {
    const { rowHeight, length } = this.props
    const { wrapperTop } = this.getScrollingData()

    if (index < 0) {
      return wrapperTop
    } if (index >= length) {
      return ((length - 1) * rowHeight) + wrapperTop
    }
    return (index * rowHeight) + wrapperTop
  }

  addListeners = (props) => {
    const scroller = this.getScroller(props)

    this.scrollTicking = false
    if (scroller) scroller.addEventListener('scroll', this.scrollListener)

    this.resizeTicking = false
    window.addEventListener('resize', this.resizeListener)
  }

  removeListeners = (props) => {
    const scroller = this.getScroller(props)

    if (scroller) scroller.removeEventListener('scroll', this.scrollListener)

    window.removeEventListener('resize', this.resizeListener)
  }

  isWindowScroll = () => this.getScroller() instanceof Window

  isValidScroller = () => {
    const scroller = this.getScroller()
    if (!this.isWindowScroll()) {
      return !!scroller && !!scroller.clientHeight && scroller.clientHeight > 0
    }
    return true
  }

  scrollToIndex = (index) => {
    const top = this.getIndexPosition(index)

    if (this.isWindowScroll()) {
      setTimeout(() => window.scrollTo(0, top))
    } else {
      this.getScroller().scrollTop = top
    }
  }

  scrollListener = () => {
    if (!this.scrollTicking) {
      window.requestAnimationFrame(() => {
        this.updateList()
        this.scrollTicking = false
      })
    }
    this.scrollTicking = true
  }

  resizeListener = () => {
    if (!this.resizeTicking) {
      window.requestAnimationFrame(() => {
        this.updateList()
        this.resizeTicking = false
      })
    }
    this.resizeTicking = true
  }

  updateList = () => {
    const {
      length,
      overscan,
      rowHeight,
      onLoadMore,
    } = this.props

    const { scrollTop, scrollHeight, wrapperTop } = this.getScrollingData()

    const start = Math.floor((scrollTop - wrapperTop) / rowHeight)
    const end = start + Math.floor(scrollHeight / rowHeight)

    if (onLoadMore && end + overscan >= length) {
      onLoadMore()
    }

    this.setState({
      startIndex: start - overscan >= 0 ? start - overscan : 0,
      endIndex: end + overscan < length ? end + overscan : (length - 1),
    })
  }

  renderList = (className) => {
    const { length, renderRow, rowHeight } = this.props
    const { startIndex, endIndex } = this.state

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
    const { scrollerRef, className } = this.props

    if (scrollerRef && !this.isValidScroller()) {
      // eslint-disable-next-line no-console
      console.error('The scroller container (scrollerRef) has a clientHeight null or equals to 0.')
      return null
    }

    if (scrollerRef) {
      return this.renderList(className)
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

Unlimited.propTypes = {
  length: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  scrollerRef: PropTypes.any,
  overscan: PropTypes.number,
  scrollToIndex: PropTypes.number,
  onLoadMore: PropTypes.func,
  className: PropTypes.string,
}

Unlimited.defaultProps = {
  scrollerRef: undefined,
  overscan: 10,
  scrollToIndex: undefined,
  onLoadMore: undefined,
  className: undefined,
}

export default Unlimited
