import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './list.css'

const List = React.forwardRef(({ items, height, renderItem, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('list', className)}
      style={{ height: `${height}px` }}
    >
      {items.map(renderItem)}
    </div>
  );
});

List.propTypes = {
  items: PropTypes.array,
  height: PropTypes.number,
  renderItem: PropTypes.func,
  className: PropTypes.string,
}

List.defaultProps = {
  items: [],
  height: 0,
}

export default List;