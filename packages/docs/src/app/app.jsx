import React, { Component } from 'react'
import range from 'lodash/range'
import toNumber from 'lodash/toNumber'
import cn from 'classnames'

import UnlimitedList from 'react-unlimited'

import './app.css'

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    infiniteLoad: true,
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

  renderRow = items => ({ index, style }) => (
    <div key={index} className="cell" style={style}>
      {items[index].name}
    </div>
  )

  render() {
    const {
      items,
      type,
      scrollToIndex,
      infiniteLoad,
    } = this.state

    return (
      <div className="app">
        <h1>Unlimited list</h1>

        <div className="toolbar">
          <button type="button" onClick={this.select('container')} className={cn({ 'btn-active': type === 'container' })}>
            Container scroll
          </button>
          <button type="button" onClick={this.select('window')} className={cn({ 'btn-active': type === 'window' })}>
            Window scroll
          </button>
          <button type="button" onClick={this.select('selfContained')} className={cn({ 'btn-active': type === 'selfContained' })}>
            Self container scroll
          </button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
          <input type="checkbox" defaultChecked={infiniteLoad} onChange={this.toggle('infiniteLoad')} />
          <span>Load more</span>
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
          <div ref={this.setContainerRef} className="container-list">
            <h2>Scroll container is a parent of the list</h2>
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
            className="self-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
          />
        )}
      </div>
    )
  }
}

export default App
