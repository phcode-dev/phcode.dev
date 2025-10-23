define(function(require,exports,module){function SelectionFold(cm,start){if(cm.somethingSelected()){var from=cm.getCursor("from"),to=cm.getCursor("to");return from.line===start.line?{from:from,to:to}:void 0}}module.exports=SelectionFold});
//# sourceMappingURL=foldSelected.js.map
