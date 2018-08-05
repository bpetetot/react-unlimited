import React,{Component}from"react";import PropTypes from"prop-types";var classCallCheck=function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),_extends=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},inherits=function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)},possibleConstructorReturn=function(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r},toConsumableArray=function(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)},range=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,r=arguments[1];return[].concat(toConsumableArray(Array(r-e).keys())).map(function(r){return r+e})},List=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,i=Array(n),s=0;s<n;s++)i[s]=arguments[s];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i))),o.handleRenderRow=function(e){var r=o.props,t=r.renderRow,n=r.rowHeight;return t({index:e,style:{position:"absolute",width:"100%",height:n+"px",top:e*n,left:0,boxSizing:"border-box",willChange:"top"},isScrolling:r.isScrolling})},o.renderList=function(){var e=o.props,r=e.startIndex,t=e.endIndex;return-1===r||-1===t?null:range(r,t+1).map(o.handleRenderRow)},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"render",value:function(){var e=this.props,r=e.forwardedRef,t=e.height,o=e.className;return React.createElement("div",{ref:r,className:o,style:{position:"relative",overflow:"hidden",height:t+"px",boxSizing:"border-box"}},this.renderList())}}]),r}();List.propTypes={forwardedRef:PropTypes.any.isRequired,startIndex:PropTypes.number.isRequired,endIndex:PropTypes.number.isRequired,isScrolling:PropTypes.bool,height:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,className:PropTypes.string},List.defaultProps={isScrolling:!1,className:void 0};var ForwardRefList=function(e,r){return React.createElement(List,_extends({},e,{forwardedRef:r}))},List$1=React.forwardRef(ForwardRefList),Unlimited=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,i=Array(n),s=0;s<n;s++)i[s]=arguments[s];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i))),o.wrapper=React.createRef(),o.scroller=React.createRef(),o.state={startIndex:-1,endIndex:-1,isScrolling:!1},o.getScroller=function(){var e=o.props.scrollWindow,r=o.scroller.current;return e?window:r},o.getScrollerData=function(){var e=o.props.scrollWindow,r=o.scroller.current;return{scrollTop:e?window.scrollY:r.scrollTop,scrollHeight:e?window.innerHeight:r.clientHeight}},o.getIndexPosition=function(e){var r=o.props,t=r.scrollWindow,n=r.rowHeight,i=r.length,s=o.wrapper.current,l=t?s.offsetTop:0;return e<0?l:e>=i?(i-1)*n+l:e*n+l},o.scrollToIndex=function(e){var r=o.props.scrollWindow,t=o.getIndexPosition(e);r?setTimeout(function(){return window.scrollTo(0,t)}):o.scroller.current.scrollTop=t},o.checkIsScrolling=function(){var e=o.state.isScrolling;o.scrollingTimeout&&clearTimeout(o.scrollingTimeout),o.scrollingTimeout=setTimeout(function(){o.setState({isScrolling:!1})},100),e||o.setState({isScrolling:!0})},o.scrollListener=function(){o.scrollTicking||window.requestAnimationFrame(function(){o.checkIsScrolling(),o.updateList(),o.scrollTicking=!1}),o.scrollTicking=!0},o.resizeListener=function(){o.resizeTicking||window.requestAnimationFrame(function(){o.updateList(),o.resizeTicking=!1}),o.resizeTicking=!0},o.updateList=function(){var e=o.props,r=e.length,t=e.overscan,n=e.scrollWindow,i=e.rowHeight,s=e.onLoadMore,l=o.wrapper.current,c=o.getScrollerData(),a=c.scrollTop,p=c.scrollHeight,u=n?a-l.offsetTop:a,d=Math.floor(u/i),f=d+Math.floor(p/i);s&&f+t>=r&&s(),o.setState({startIndex:d-t>=0?d-t:0,endIndex:f+t<r?f+t:r-1})},o.renderList=function(e){var r=o.props,t=r.length,n=r.renderRow,i=r.rowHeight,s=o.state,l=s.startIndex,c=s.endIndex,a=s.isScrolling;return React.createElement(List$1,{ref:o.wrapper,startIndex:l,endIndex:c,isScrolling:a,height:i*t,rowHeight:i,renderRow:n,className:e})},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"componentDidMount",value:function(){var e=this.props.scrollToIndex;this.scrollTicking=!1,this.getScroller().addEventListener("scroll",this.scrollListener),this.resizeTicking=!1,window.addEventListener("resize",this.resizeListener),e?this.scrollToIndex(e):this.updateList()}},{key:"componentDidUpdate",value:function(e){var r=this.props,t=r.scrollToIndex;r.length!==e.length&&this.updateList(),t&&t!==e.scrollToIndex&&this.scrollToIndex(t)}},{key:"componentWillUnmount",value:function(){this.getScroller().removeEventListener("scroll",this.scrollListener),window.removeEventListener("resize",this.resizeListener)}},{key:"render",value:function(){var e=this.props,r=e.scrollWindow,t=e.className;return r?this.renderList(t):React.createElement("div",{ref:this.scroller,className:t,style:{overflow:"auto",willChange:"scroll-position"}},this.renderList())}}]),r}();Unlimited.propTypes={length:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,overscan:PropTypes.number,scrollWindow:PropTypes.bool,scrollToIndex:PropTypes.number,onLoadMore:PropTypes.func,className:PropTypes.string},Unlimited.defaultProps={overscan:10,scrollWindow:!1,scrollToIndex:void 0,onLoadMore:void 0,className:void 0};export default Unlimited;
