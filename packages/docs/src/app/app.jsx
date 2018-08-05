import React, { Component } from 'react'
import range from 'lodash/range'
import toNumber from 'lodash/toNumber'

import UnlimitedList from 'react-unlimited'

import './app.css'

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    infiniteLoad: true,
    showScrolling: false,
  }

  componentDidMount() {
    const items = this.createItems(0, 100)
    this.setState({ items })
  }

  setContainerRef = (ref) => {
    this.containerRef = ref
  }

  createItems = (start, end) => range(start, end).map(id => ({ name: `item-${id}` }))

  select = type => () => {
    this.setState({ type })
  }

  scrollTo = (e) => {
    this.setState({ scrollToIndex: toNumber(e.target.value) })
  }

  toggle = key => () => {
    this.setState(state => ({ [key]: !state[key] }))
  }

  handleLoadMore = () => {
    this.setState(({ items }) => ({
      items: [...items, ...this.createItems(items.length, items.length + 50)],
    }))
  }

  renderRow = items => ({ index, style, isScrolling }) => {
    const { showScrolling } = this.state
    return (
      <div key={index} className="cell" style={style}>
        {items[index].name}
        {showScrolling && isScrolling ? ' is scrolling...' : null}
      </div>
    )
  }

  render() {
    const { type, scrollToIndex, infiniteLoad } = this.state

    const { items } = this.state
    console.log(this.containerRef)
    return (
      <div className="app">
        <h1>Unlimited list</h1>

        <div className="toolbar">
          <button type="button" onClick={this.select('container')}>
            Container scroll
          </button>
          <button type="button" onClick={this.select('window')}>
            Window scroll
          </button>
          <button type="button" onClick={this.select('selfContained')}>
            Self container scroll
          </button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
          <input type="checkbox" defaultChecked={infiniteLoad} onChange={this.toggle('infiniteLoad')} />
          <span>Load more</span>
          <input type="checkbox" onChange={this.toggle('showScrolling')} />
          <span>Show scrolling</span>
        </div>

        {type === 'window' && (
          <UnlimitedList
            scrollerRef={window}
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={3}
            className="my-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
          />
        )}

        {type === 'container' && (
          <div ref={this.setContainerRef} className="my-list container-list">
            <UnlimitedList
              scrollerRef={this.containerRef}
              length={items.length}
              rowHeight={50}
              renderRow={this.renderRow(items)}
              overscan={3}
              scrollToIndex={scrollToIndex}
              onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
            />
          </div>
        )}

        {type === 'selfContained' && (
          <UnlimitedList
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={3}
            className="my-list self-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
          />
        )}
      </div>
    )
  }
}

export default App
