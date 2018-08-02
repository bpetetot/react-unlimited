import React, { Component } from 'react';
import range from "lodash/range";

import Infinite from "./infinite";

import "./app.css";

class App extends Component {
  state = {
    type: 'container',
    scrollToIndex: undefined,
  }

  select = type => () => this.setState({ type })

  scrollTo = e => this.setState({ scrollToIndex: e.target.value ? Number(e.target.value) : undefined })

  render() {
    const { type, scrollToIndex } = this.state;

    const items = range(0, 1000).map((id) => ({
      id,
      name: `item-${id}`
    }));

    return (
      <div className="app">
        <div>
          <button onClick={this.select('container')}>Container scroll</button>
          <button onClick={this.select('window')}>Window scroll</button>
          <input type="text" placeholder="scrollTo" onChange={this.scrollTo} />
        </div>

        {type === 'window' && (
          <Infinite
            items={items}
            rowHeight={50}
            overscan={3}
            scrollerRef={window}
            className="my-list"
            scrollWindow
            scrollToIndex={scrollToIndex}
          />
        )}

        {type === 'container' && (
          <Infinite
            items={items}
            rowHeight={50}
            overscan={3}
            scrollerRef={window}
            className="my-list sized-list"
            scrollToIndex={scrollToIndex}
          />
        )}
      </div>
    );
  }
}

export default App;
