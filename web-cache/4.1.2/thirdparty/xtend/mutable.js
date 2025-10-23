module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;function extend(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target}
//# sourceMappingURL=mutable.js.map
