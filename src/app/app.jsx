import React, { Component } from 'react';
import range from 'lodash/range';
import toNumber from 'lodash/toNumber'

import Infinite from './infinite';

import './app.css';

class App extends Component {
  state = {
    items: [],
    type: 'container',
    scrollToIndex: undefined,
    loadMore: false,
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

  toggleLoadMore = () =>{
    this.setState(state => ({ loadMore: !state.loadMore }))
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

  renderRow = items => ({ index, style }) => (
    <div
      key={index}
      className="cell"
      style={style}
    >
      {items[index].name}
    </div>
  )

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
          <input type="checkbox" onChange={this.toggleLoadMore} />
          <label>Load more</label>
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
