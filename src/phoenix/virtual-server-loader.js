import{Workbox}from"https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-window.prod.mjs";function _getBaseURL(){let baseURL=window.location.href;return location.href.indexOf("?")>-1&&(baseURL=location.href.substring(0,location.href.indexOf("?"))),location.href.indexOf("#")>-1&&(baseURL=baseURL.substring(0,baseURL.indexOf("#"))),location.href.indexOf("/")>-1&&(baseURL=baseURL.substring(0,baseURL.lastIndexOf("/"))),baseURL.endsWith("/")||(baseURL+="/"),baseURL}function getRoute(){return"phoenix/vfs"}function _isServiceWorkerLoaderPage(){let indexUrl=`${location.origin}/index.html`,baseUrl=`${location.origin}/`,devURL="http://localhost:8000/src/";return location.href===baseUrl||location.href===indexUrl||location.href===devURL}async function shouldUpdate(){return!0}if(window.fsServerUrl=_getBaseURL()+getRoute()+"/",_isServiceWorkerLoaderPage()&&"serviceWorker"in navigator){console.log("Service worker loader: Loading  from page...",window.location.href);const wb=new Workbox(`virtual-server-main.js?debug=${"true"===window.logToConsolePref}&route=${getRoute()}`,{updateViaCache:"none"});function _refreshCache(){console.log("Service worker loader: triggering REFRESH_CACHE"),wb.messageSW({type:"REFRESH_CACHE"}).then(msg=>{console.log("Service worker loader: ",msg)}).catch(err=>{console.error("Service worker loader: Error while triggering cache refresh",err)})}function serverReady(){console.log("Service worker loader: Server ready."),wb.messageSW({type:"GET_SW_BASE_URL"}).then(fsServerUrl=>{console.log(`Service worker loader: Server ready! Service worker initialised at base url: ${fsServerUrl}`)}).catch(err=>{console.error("Service worker loader: Error while init of service worker",err)}),_refreshCache()}function serverInstall(){console.log("Service worker loader: Web server Worker installed.")}const showSkipWaitingPrompt=async event=>{const updateAccepted=await shouldUpdate();updateAccepted&&wb.messageSkipWaiting()};wb.addEventListener("waiting",event=>{console.log("Service worker loader: A new service worker is pending load. Trying to update the worker now."),showSkipWaitingPrompt(event)}),wb.controlling.then(serverReady),wb.addEventListener("installed",event=>{event.isUpdate||serverInstall()}),wb.register()}
//# sourceMappingURL=virtual-server-loader.js.map
