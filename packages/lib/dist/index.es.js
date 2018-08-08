import React,{Component}from"react";import PropTypes from"prop-types";import fastdomPromised from"fastdom/extensions/fastdom-promised";import fastdom from"fastdom";var classCallCheck=function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),_extends=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},inherits=function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)},objectWithoutProperties=function(e,r){var t={};for(var o in e)r.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},possibleConstructorReturn=function(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r},toConsumableArray=function(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)},range=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,r=arguments[1];return[].concat(toConsumableArray(Array(r-e).keys())).map(function(r){return r+e})},List=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,s=Array(n),i=0;i<n;i++)s[i]=arguments[i];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(s))),o.handleRenderRow=function(e){var r=o.props,t=r.renderRow,n=r.rowHeight;return t({index:e,style:{position:"absolute",width:"100%",height:n+"px",top:0,transform:"translate(0, "+e*n+"px)",left:0,boxSizing:"border-box",willChange:"transform"}})},o.renderList=function(){var e=o.props,r=e.startIndex,t=e.endIndex;return-1===r||-1===t?null:range(r,t+1).map(o.handleRenderRow)},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"render",value:function(){var e=this.props,r=e.forwardedRef,t=e.height,o=e.className;return React.createElement("div",{ref:r,className:o,style:{position:"relative",overflow:"hidden",height:t+"px",boxSizing:"border-box"}},this.renderList())}}]),r}();List.propTypes={forwardedRef:PropTypes.any.isRequired,startIndex:PropTypes.number.isRequired,endIndex:PropTypes.number.isRequired,height:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,className:PropTypes.string},List.defaultProps={className:void 0};var ForwardRefList=function(e,r){return React.createElement(List,_extends({},e,{forwardedRef:r}))},List$1=React.forwardRef(ForwardRefList),myFastdom=fastdom.extend(fastdomPromised),Unlimited=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,s=Array(n),i=0;i<n;i++)s[i]=arguments[i];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(s))),o.wrapper=React.createRef(),o.state={startIndex:-1,endIndex:-1},o.getScrollingData=function(){return myFastdom.measure(function(){var e=o.props.scrollerRef,r=o.wrapper.current;return e instanceof Window?{wrapperTop:r.offsetTop,scrollTop:e.scrollY,scrollHeight:e.innerHeight}:{wrapperTop:r.offsetTop-e.offsetTop,scrollTop:e.scrollTop,scrollHeight:e.clientHeight}})},o.getIndexPosition=function(e){return o.getScrollingData().then(function(r){var t=r.wrapperTop,n=o.props,s=n.rowHeight,i=n.length;return e<0?t:e>=i?(i-1)*s+t:e*s+t})},o.addListeners=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:o.props).scrollerRef;o.scrollTicking=!1,e&&e.addEventListener("scroll",o.scrollListener),o.resizeTicking=!1,window.addEventListener("resize",o.resizeListener)},o.removeListeners=function(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:o.props).scrollerRef;e&&e.removeEventListener("scroll",o.scrollListener),window.removeEventListener("resize",o.resizeListener),o.scrollRAF&&cancelAnimationFrame(o.scrollRAF),o.resizeRAF&&cancelAnimationFrame(o.resizeRAF)},o.scrollToIndex=function(e){var r=o.props.scrollerRef;o.getIndexPosition(e).then(function(e){r instanceof Window?setTimeout(function(){return r.scrollTo(0,e)}):myFastdom.mutate(function(){r.scrollTop=e})})},o.scrollListener=function(){o.scrollTicking||(o.scrollRAF=window.requestAnimationFrame(function(){o.updateList(),o.scrollTicking=!1})),o.scrollTicking=!0},o.resizeListener=function(){o.resizeTicking||(o.resizeRAF=window.requestAnimationFrame(function(){o.updateList(),o.resizeTicking=!1})),o.resizeTicking=!0},o.updateList=function(){var e=o.props,r=e.length,t=e.overscan,n=e.rowHeight,s=e.onLoadMore;o.getScrollingData().then(function(e){var i=e.scrollTop,a=e.scrollHeight,l=e.wrapperTop,c=Math.floor((i-l)/n),p=c+Math.floor(a/n);s&&p+t>=r&&s(),o.setState({startIndex:c-t>=0?c-t:0,endIndex:p+t<r?p+t:r-1})})},o.renderList=function(e){var r=o.props,t=r.length,n=r.renderRow,s=r.rowHeight,i=o.state,a=i.startIndex,l=i.endIndex;return React.createElement(List$1,{ref:o.wrapper,startIndex:a,endIndex:l,height:s*t,rowHeight:s,renderRow:n,className:e})},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"componentDidMount",value:function(){var e=this.props,r=e.scrollerRef,t=e.scrollToIndex;r&&(this.addListeners(),t?this.scrollToIndex(t):this.updateList())}},{key:"componentDidUpdate",value:function(e){var r=this.props,t=r.scrollerRef,o=r.scrollToIndex,n=r.length;t&&t!==e.scrollerRef&&(this.removeListeners(e),this.addListeners(),this.updateList()),n!==e.length&&this.updateList(),o&&o!==e.scrollToIndex&&this.scrollToIndex(o)}},{key:"componentWillUnmount",value:function(){this.removeListeners()}},{key:"render",value:function(){var e=this.props.className;return this.renderList(e)}}]),r}();Unlimited.propTypes={length:PropTypes.number.isRequired,rowHeight:PropTypes.number.isRequired,renderRow:PropTypes.func.isRequired,scrollerRef:PropTypes.any,overscan:PropTypes.number,scrollToIndex:PropTypes.number,onLoadMore:PropTypes.func,className:PropTypes.string},Unlimited.defaultProps={scrollerRef:void 0,overscan:10,scrollToIndex:void 0,onLoadMore:void 0,className:void 0};var UnlimitedSizedList=function(e){function r(){var e,t,o;classCallCheck(this,r);for(var n=arguments.length,s=Array(n),i=0;i<n;i++)s[i]=arguments[i];return t=o=possibleConstructorReturn(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(s))),o.state={ref:void 0},o.setRef=function(e){return o.setState({ref:e})},possibleConstructorReturn(o,t)}return inherits(r,Component),createClass(r,[{key:"render",value:function(){var e=this.props,r=e.height,t=e.width,o=e.className,n=objectWithoutProperties(e,["height","width","className"]),s=this.state.ref;return React.createElement("div",{ref:this.setRef,className:o,style:{height:r,width:t,overflow:"auto",willChange:"scroll-position"}},React.createElement(Unlimited,_extends({scrollerRef:s},n)))}}]),r}();UnlimitedSizedList.propTypes={height:PropTypes.number.isRequired,width:PropTypes.number.isRequired,className:PropTypes.string},UnlimitedSizedList.defaultProps={className:void 0};export default Unlimited;export{UnlimitedSizedList};
