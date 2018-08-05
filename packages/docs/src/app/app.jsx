import React, { Component } from 'react'
import range from 'lodash/range'
import toNumber from 'lodash/toNumber'

import Infinite from 'infinite-list'

import './app.css'

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    loadMore: false,
    showScrolling: false,
  }

  componentDidMount() {
    const items = this.createItems(0, 100)
    this.setState({ items })
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
      items: [
        ...items,
        ...this.createItems(items.length, items.length + 50),
      ],
    }
    ))
  }

  renderRow = items => ({ index, style, isScrolling }) => {
    const { showScrolling } = this.state
    return (
      <div
        key={index}
        className="cell"
        style={style}
      >
        {items[index].name}
        {showScrolling && isScrolling ? ' is scrolling...' : null}
      </div>
    )
  }

  render() {
    const { type, scrollToIndex, loadMore } = this.state
    const { items } = this.state

    return (
      <div className="app">
        <h1>Infinite list</h1>

        <div className="toolbar">
          <button type="button" onClick={this.select('container')}>
            Container scroll
          </button>
          <button type="button" onClick={this.select('window')}>
            Window scroll
          </button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
          <input type="checkbox" onChange={this.toggle('loadMore')} />
          <span>Load more</span>
          <input type="checkbox" onChange={this.toggle('showScrolling')} />
          <span>Show scrolling</span>
        </div>

        {type === 'window' && (
          <Infinite
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={3}
            className="my-list"
            scrollWindow
            scrollToIndex={scrollToIndex}
            onLoadMore={loadMore ? this.handleLoadMore : undefined}
          />
        )}

        {type === 'container' && (
          <Infinite
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={3}
            className="my-list sized-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={loadMore ? this.handleLoadMore : undefined}
          />
        )}
      </div>
    )
  }
}

export default App
