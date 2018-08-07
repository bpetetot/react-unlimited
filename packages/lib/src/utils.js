/* eslint-disable import/prefer-default-export */

export const range = (start = 0, end) => [...Array(end - start).keys()].map(i => i + start)

export const hasHorizontalScrollbar = element => element.scrollWidth > element.clientWidth

export const hasVerticalScrollbar = element => element.scrollHeight > element.clientHeight
