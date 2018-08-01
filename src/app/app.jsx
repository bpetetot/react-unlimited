import React from "react";
import range from "lodash/range";

import Infinite from "./infinite";

import "./app.css";

const App = () => {
  const items = range(0, 1000).map((id) => ({
    id,
    name: `item-${id}`
  }));

  return (
    <div className="app">
      <h1>Infinite List</h1>
      <Infinite
        items={items}
        rowHeight={50}
        overscan={3}
        scrollerRef={window}
      />
    </div>
  );
};

export default App;
