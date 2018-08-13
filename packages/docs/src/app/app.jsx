import React, { Component } from 'react'
import range from 'lodash/range'
import toNumber from 'lodash/toNumber'
import cn from 'classnames'

import { UnlimitedList, UnlimitedSizedList } from 'react-unlimited'

import './app.css'

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    infiniteLoad: false,
    containerRef: undefined,
  }

  componentDidMount() {
    const items = this.createItems(0, 1000)
    this.setState({ items })
  }

  setContainerRef = containerRef => this.setState({ containerRef })

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
      containerRef,
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
          <button type="button" onClick={this.select('sized')} className={cn({ 'btn-active': type === 'sized' })}>
            Sized
          </button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
          <input type="checkbox" defaultChecked={infiniteLoad} onChange={this.toggle('infiniteLoad')} />
          <span>Load more</span>
        </div>

        {type === 'container' && (
          <div ref={this.setContainerRef} className="container-list">
            <h2>Scroll container is a parent of the list</h2>
            <UnlimitedList
              scrollerRef={containerRef}
              length={items.length}
              rowHeight={50}
              renderRow={this.renderRow(items)}
              overscan={5}
              scrollToIndex={scrollToIndex}
              onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
            />
          </div>
        )}

        {type === 'window' && (
          <UnlimitedList
            scrollerRef={window}
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={5}
            className="my-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
          />
        )}

        {type === 'sized' && (
          <UnlimitedSizedList
            height={400}
            width={600}
            length={items.length}
            rowHeight={50}
            renderRow={this.renderRow(items)}
            overscan={5}
            className="my-list"
            scrollToIndex={scrollToIndex}
            onLoadMore={infiniteLoad ? this.handleLoadMore : undefined}
          />
        )}
      </div>
    )
  }
}

export default App
