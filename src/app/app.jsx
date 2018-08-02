import React, { Component } from 'react';
import range from "lodash/range";

import Infinite from "./infinite";

import "./app.css";

class App extends Component {
  state = {
    type: 'container',
  }

  select = type => () => this.setState({ type })

  render() {
    const { type } = this.state;

    const items = range(0, 1000).map((id) => ({
      id,
      name: `item-${id}`
    }));

    return (
      <div className="app">
        <div>
          <button onClick={this.select('container')}>Container scroll</button>
          <button onClick={this.select('window')}>Window scroll</button>
        </div>
        {type === 'window' && (
          <Infinite
            items={items}
            rowHeight={50}
            overscan={3}
            scrollerRef={window}
            className="my-list"
            scrollWindow
          />
        )}
        {type === 'container' && (
          <Infinite
            items={items}
            rowHeight={50}
            overscan={3}
            scrollerRef={window}
            className="my-list sized-list"
          />
        )}
      </div>
    );
  }
}

export default App;
