if(importScripts("phoenix/virtualServer/config.js"),!self.Serve){const _serverBroadcastChannel=new BroadcastChannel("virtual_server_broadcast"),fs=self.fs,Path=self.path;let instrumentedURLs={},responseListeners={};function _getNewRequestID(){return Math.round(1e12*Math.random())}function formatContentDisposition(path,stats){const filename=Path.basename(path),modified=stats.mtime.toUTCString();return`attachment; filename="${filename}"; modification-date="${modified}"; size=${stats.size};`}async function _wait(timeMs){return new Promise(resolve=>{setTimeout(resolve,timeMs)})}async function _resolvingRead(path,encoding){return new Promise(resolve=>{fs.readFile(path,encoding,function(error,contents){resolve({error:error,contents:contents})})})}async function _resolvingStat(path){return new Promise(resolve=>{fs.stat(path,function(error,stats){resolve({error:error,stats:stats})})})}const FILE_READ_RETRY_COUNT=5,BACKOFF_TIME_MS=10,serve=async function(path,formatter,download){return path=Path.normalize(path),new Promise(async(resolve,reject)=>{function buildResponse(responseData){return new Response(responseData.body,responseData.config)}function serveError(path,err){if("ENOENT"===err.code)return resolve(buildResponse(formatter.format404(path)));resolve(buildResponse(formatter.format500(path,err)))}async function serveInstrumentedFile(path,stats){let allURLs=[];for(let rootPaths of Object.keys(instrumentedURLs))for(let subPath of instrumentedURLs[rootPaths])allURLs.push(Path.normalize(rootPaths+subPath));if(allURLs.includes(path)){self._debugLivePreviewLog("Service worker: serving instrumented file",path);const requestID=_getNewRequestID();return _serverBroadcastChannel.postMessage({type:"getInstrumentedContent",path:path,requestID:requestID}),responseListeners[requestID]=function(response){if(!response.contents)return self._debugLivePreviewLog("Service worker: no instrumented file received from phoenix!",path),void serveFileContent(path,stats);const responseData=formatter.formatFile(path,response.contents,stats);resolve(new Response(responseData.body,responseData.config))},!0}return!1}async function serveFileContent(path,stats){let err=null;for(let i=1;i<=FILE_READ_RETRY_COUNT;i++){let fileResponse=await _resolvingRead(path,fs.BYTE_ARRAY_ENCODING);if(fileResponse.error){err=fileResponse.error,await _wait(i*BACKOFF_TIME_MS);continue}const responseData=formatter.formatFile(path,fileResponse.contents,stats);return 200===responseData.config.status&&download&&(responseData.config.headers["Content-Disposition"]=formatContentDisposition(path,stats)),void resolve(new Response(responseData.body,responseData.config))}serveError(path,err)}async function serveFile(path,stats){let fileServed;await serveInstrumentedFile(path,stats)||serveFileContent(path,stats)}function serveDir(path){function maybeServeIndexFile(){if(path.endsWith("//"))return void serveDirListing();const indexPath=Path.join(path,"index.html");fs.stat(indexPath,function(err,stats){err?"ENOENT"!==err.code||Config.disableIndexes?serveError(path,err):serveDirListing():serveFile(indexPath,stats)})}function serveDirListing(){fs.readdir(path,function(err,entries){if(err)return serveError(path,err);const responseData=formatter.formatDir(virtualServerBaseURL,path,entries);resolve(new Response(responseData.body,responseData.config))})}maybeServeIndexFile()}let err=null;try{for(let i=1;i<=FILE_READ_RETRY_COUNT;i++){let fileStat=await _resolvingStat(path);if(!fileStat.error)return fileStat.stats.isDirectory()?serveDir(path):serveFile(path,fileStat.stats);err=fileStat.error,await _wait(i*BACKOFF_TIME_MS)}return serveError(path,err)}catch(e){reject(e)}})};async function setInstrumentedURLs(event){const data=event.data,root=data.root,paths=data.paths;self._debugLivePreviewLog("Service worker: setInstrumentedURLs",data),instrumentedURLs[root]=paths,event.ports[0].postMessage(!0)}function processVirtualServerMessage(event){let eventType;switch(event.data&&event.data.type){case"REQUEST_RESPONSE":const requestID=event.data.requestID;if(event.data.requestID&&responseListeners[requestID])return responseListeners[requestID](event.data),delete responseListeners[requestID],!0}}console.log("service worker init"),_serverBroadcastChannel.onmessage=processVirtualServerMessage,self.Serve={serve:serve,setInstrumentedURLs:setInstrumentedURLs}}
//# sourceMappingURL=webserver.js.map
