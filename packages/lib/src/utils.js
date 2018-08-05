/* eslint-disable import/prefer-default-export */

export const range = (start = 0, end) => [...Array(end - start).keys()].map(i => i + start)
