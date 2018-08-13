import React, { Component } from 'react'
import PropTypes from 'prop-types'

import fastdomPromised from 'fastdom/extensions/fastdom-promised'
import fastdom from 'fastdom'

import List from './list'

const myFastdom = fastdom.extend(fastdomPromised)

class Unlimited extends Component {
  wrapper = React.createRef()

  state = {
    startIndex: -1,
    endIndex: -1,
    height: 0,
    width: 0,
    lastScrollTop: 0,
    lastScrollTime: Date.now(),
  }

  componentDidMount() {
    const { scrollerRef, scrollToIndex } = this.props

    if (scrollerRef) {
      this.addListeners()
      this.updateDimensions()

      if (scrollToIndex) {
        this.scrollToIndex(scrollToIndex)
      } else {
        this.updateList()
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollerRef, scrollToIndex, length } = this.props

    if (scrollerRef && scrollerRef !== prevProps.scrollerRef) {
      this.removeListeners(prevProps)
      this.addListeners()
      this.updateList()
      this.updateDimensions()
    }

    if (length !== prevProps.length) {
      this.updateList()
      this.updateDimensions()
    }

    if (scrollToIndex && scrollToIndex !== prevProps.scrollToIndex) {
      this.scrollToIndex(scrollToIndex)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  getScrollingData = () => myFastdom.measure(() => {
    const { scrollerRef } = this.props
    const { current } = this.wrapper

    if (scrollerRef instanceof Window) {
      return {
        wrapperTop: current.offsetTop,
        scrollTop: scrollerRef.scrollY,
        scrollHeight: scrollerRef.innerHeight,
        scrollWidth: scrollerRef.innerWidth,
      }
    }
    return {
      wrapperTop: current.offsetTop - scrollerRef.offsetTop,
      scrollTop: scrollerRef.scrollTop,
      scrollHeight: scrollerRef.clientHeight,
      scrollWidth: scrollerRef.clientWidth,
    }
  })

  getIndexPosition = index => this.getScrollingData()
    .then(({ wrapperTop }) => {
      const { rowHeight, length } = this.props
      if (index < 0) {
        return wrapperTop
      } if (index >= length) {
        return ((length - 1) * rowHeight) + wrapperTop
      }
      return (index * rowHeight) + wrapperTop
    })

  addListeners = (props = this.props) => {
    const { scrollerRef } = props

    this.scrollTicking = false
    if (scrollerRef) scrollerRef.addEventListener('scroll', this.scrollListener)

    this.resizeTicking = false
    window.addEventListener('resize', this.resizeListener)
  }

  removeListeners = (props = this.props) => {
    const { scrollerRef } = props

    if (scrollerRef) scrollerRef.removeEventListener('scroll', this.scrollListener)
    window.removeEventListener('resize', this.resizeListener)

    if (this.scrollRAF) cancelAnimationFrame(this.scrollRAF)
    if (this.resizeRAF) cancelAnimationFrame(this.resizeRAF)
  }

  scrollToIndex = (index) => {
    const { scrollerRef } = this.props
    this.getIndexPosition(index).then((top) => {
      if (scrollerRef instanceof Window) {
        setTimeout(() => scrollerRef.scrollTo(0, top))
      } else {
        myFastdom.mutate(() => {
          scrollerRef.scrollTop = top
        })
      }
    })
  }

  scrollListener = () => {
    if (!this.scrollTicking) {
      this.scrollRAF = window.requestAnimationFrame(() => {
        this.updateList()
        this.scrollTicking = false
      })
    }
    this.scrollTicking = true
  }

  resizeListener = () => {
    if (!this.resizeTicking) {
      this.resizeRAF = window.requestAnimationFrame(() => {
        this.updateList()
        this.updateDimensions()
        this.resizeTicking = false
      })
    }
    this.resizeTicking = true
  }

  computePosition = () => this.getScrollingData()
    .then(({
      scrollTop,
      scrollHeight,
      scrollWidth,
      wrapperTop,
    }) => {
      const { length, overscan, rowHeight } = this.props
      const { lastScrollTop, lastScrollTime } = this.state

      // compute start and end index window
      const start = Math.floor((scrollTop - wrapperTop) / rowHeight)
      const end = start + Math.floor(scrollHeight / rowHeight)

      // compute scroll velocity
      const time = Math.min(1, (Date.now() - lastScrollTime) / 16)
      const delta = Math.min(scrollHeight, scrollTop - lastScrollTop)
      const scrollVelocitySize = Math.floor((delta * time) / rowHeight)

      // compute overscan with scroll velocity
      let overscanStart = overscan
      let overscanEnd = overscan
      if (scrollVelocitySize < 0) {
        overscanStart = overscan + Math.abs(scrollVelocitySize)
      } else if (scrollVelocitySize > 0) {
        overscanEnd = overscan + Math.abs(scrollVelocitySize)
      }

      return {
        startIndex: start - overscanStart >= 0 ? start - overscanStart : 0,
        endIndex: end + overscanEnd < length ? end + overscanEnd : (length - 1),
        height: rowHeight * length,
        width: scrollWidth,
        scrollTop,
      }
    });

  updateDimensions = () => this.computePosition()
    .then(({ height, width }) => this.setState({ height, width }))

  updateList = () => {
    const { length, onLoadMore, overscan } = this.props

    this.computePosition()
      .then(({
        startIndex,
        endIndex,
        scrollTop,
      }) => {
        if (onLoadMore && (endIndex + overscan) >= length) {
          onLoadMore()
        }
        this.setState(() => ({
          startIndex,
          endIndex,
          lastScrollTop: scrollTop,
          lastScrollTime: Date.now(),
        }))
      })
  }

  renderList = (className) => {
    const { renderRow, rowHeight } = this.props
    const {
      startIndex,
      endIndex,
      width,
      height,
    } = this.state

    return (
      <List
        ref={this.wrapper}
        startIndex={startIndex}
        endIndex={endIndex}
        height={height}
        width={width}
        rowHeight={rowHeight}
        renderRow={renderRow}
        className={className}
      />
    )
  }

  render() {
    const { className } = this.props

    return this.renderList(className)
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
