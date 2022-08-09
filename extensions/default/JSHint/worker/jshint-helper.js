importScripts(`${Phoenix.baseURL}thirdparty/jshint.js`),function(){function jsHint(params){let lintResult;return{lintResult:JSHINT(params.text,params.options),errors:JSHINT.errors}}WorkerComm.setExecHandler("jsHint",jsHint)}();
//# sourceMappingURL=jshint-helper.js.map
