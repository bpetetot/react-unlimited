import React, { Component } from 'react';
import range from 'lodash/range';
import toNumber from 'lodash/toNumber'

import Infinite from 'infinite-list';

import './app.css';

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    loadMore: false,
    showScrolling: false,
  }

  createItems = (start, end) => range(start, end).map((id) => ({ name: `item-${id}` }))

  componentDidMount() {
    const items = this.createItems(0, 100);
    this.setState({ items })
  }

  select = type => () => {
    this.setState({ type })
  }

  scrollTo = e => {
    this.setState({ scrollToIndex: toNumber(e.target.value) })
  }

  toggle = key => () =>{
    this.setState(state => ({ [key]: !state[key] }))
  }

  handleLoadMore = () => {
    this.setState(({ items }) => ({
        items: [
          ...items,
          ...this.createItems(items.length, items.length + 50)
        ]
      }
    ))
  }

  renderRow = items => ({ index, style, isScrolling }) => {
    const { showScrolling } = this.state;
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
    const { type, scrollToIndex, loadMore } = this.state;
    const { items } = this.state;

    return (
      <div className="app">
        <h1>Infinite list</h1>

        <div className="toolbar">
          <button onClick={this.select('container')}>Container scroll</button>
          <button onClick={this.select('window')}>Window scroll</button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
          <input type="checkbox" onChange={this.toggle('loadMore')} />
          <label>Load more</label>
          <input type="checkbox" onChange={this.toggle('showScrolling')} />
          <label>Show scrolling</label>
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
    );
  }
}

export default App;
