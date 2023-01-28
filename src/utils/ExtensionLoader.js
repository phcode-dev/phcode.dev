define(function(require,exports,module){require("utils/Global");const _=require("thirdparty/lodash"),EventDispatcher=require("utils/EventDispatcher"),FileSystem=require("filesystem/FileSystem"),FileUtils=require("file/FileUtils"),Async=require("utils/Async"),ExtensionUtils=require("utils/ExtensionUtils"),UrlParams=require("utils/UrlParams").UrlParams,PathUtils=require("thirdparty/path-utils/path-utils"),DefaultExtensionsList=JSON.parse(require("text!extensions/default/DefaultExtensions.json")).defaultExtensionsList;var EXTENSION_LOAD_TIMOUT_SECONDS=60,INIT_EXTENSION_TIMEOUT,EVENT_EXTENSION_LOADED="load",EVENT_EXTENSION_DISABLED="disabled",EVENT_EXTENSION_LOAD_FAILED="loadFailed",_init=!1,_extensions={},_initExtensionTimeout=1e3*EXTENSION_LOAD_TIMOUT_SECONDS,srcPath=FileUtils.getNativeBracketsDirectoryPath(),contexts={},pathLib=Phoenix.VFS.path;srcPath=srcPath.replace(/\/test$/,"/src");var globalPaths=brackets._getGlobalRequireJSConfig().paths;Object.keys(globalPaths).forEach(function(key){globalPaths[key]=PathUtils.makePathAbsolute(srcPath+"/"+globalPaths[key])});const DEFAULT_EXTENSIONS_PATH_BASE="/extensions/default";function getDefaultExtensionPath(){const href=window.location.href,baseUrl=href.substring(0,href.lastIndexOf("/"));return baseUrl+DEFAULT_EXTENSIONS_PATH_BASE}function _getExtensionPath(){return pathLib.normalize(Phoenix.VFS.getExtensionDir())}function getDevExtensionPath(){return pathLib.normalize(Phoenix.VFS.getDevExtensionDir())}function getUserExtensionPath(){return pathLib.normalize(Phoenix.VFS.getUserExtensionDir())}function getRequireContextForExtension(name){return contexts[name]}function _getInitExtensionTimeout(){return _initExtensionTimeout}function _setInitExtensionTimeout(value){_initExtensionTimeout=value}function _mergeConfigFromURL(baseConfig){var deferred=new $.Deferred,extensionConfigFile=baseConfig.baseUrl+"/requirejs-config.json";return $.get(extensionConfigFile).done(function(extensionConfig){if(0!==Object.keys(extensionConfig||{}).length)try{extensionConfig.paths||(extensionConfig.paths={}),_.extend(extensionConfig.paths,baseConfig.paths),_.extend(extensionConfig,_.omit(baseConfig,"paths")),deferred.resolve(extensionConfig)}catch(err){deferred.reject("failed to parse requirejs-config.json")}else deferred.resolve(baseConfig)}).fail(function(err){200===err.status&&console.error("[Extension] The require config file provided is invalid",extensionConfigFile),deferred.resolve(baseConfig)}),deferred.promise()}function _mergeConfig(baseConfig){if(baseConfig.baseUrl.startsWith("http://")||baseConfig.baseUrl.startsWith("https://"))return _mergeConfigFromURL(baseConfig);throw new Error("Config can only be loaded from an http url, but got"+baseConfig.baseUrl)}function loadExtensionModule(name,config,entryPoint){let extensionConfig={context:name,baseUrl:config.baseUrl,paths:globalPaths,locale:brackets.getLocale(),waitSeconds:EXTENSION_LOAD_TIMOUT_SECONDS};const isDefaultExtensionModule=extensionConfig.baseUrl&&extensionConfig.baseUrl.startsWith(`${location.href}extensions/default/`);return _mergeConfig(extensionConfig).then(function(mergedConfig){var extensionRequire=brackets.libRequire.config(mergedConfig),extensionRequireDeferred=new $.Deferred;return contexts[name]=extensionRequire,extensionRequire([entryPoint],extensionRequireDeferred.resolve,extensionRequireDeferred.reject),extensionRequireDeferred.promise()}).then(function(module){var initPromise;if(_extensions[name]=module,module&&module.initExtension&&"function"==typeof module.initExtension){try{initPromise=Async.withTimeout(module.initExtension(),_getInitExtensionTimeout())}catch(err){return console.error("[Extension] Error -- error thrown during initExtension for "+name+": "+err),logger.reportError(err),(new $.Deferred).reject(err).promise()}if(initPromise)return initPromise.fail(function(err){let errorMessage="[Extension] Error -- timeout during initExtension for "+name;err===Async.ERROR_TIMEOUT?console.error(errorMessage):(errorMessage="[Extension] Error -- failed initExtension for "+name,console.error(errorMessage+(err?": "+err:""))),isDefaultExtensionModule&&logger.reportError(err,errorMessage)}),initPromise}},function errback(err){var additionalInfo=String(err);"scripterror"===err.requireType&&err.originalError&&(additionalInfo="Module does not exist: "+err.originalError.target.src),console.error("[Extension] failed to load "+config.baseUrl+" - "+additionalInfo),isDefaultExtensionModule&&logger.reportError(err,"[Extension] failed to load "+config.baseUrl+" - "+additionalInfo),"define"===err.requireType&&console.log(err.stack)})}function loadExtension(name,config,entryPoint){var promise=new $.Deferred;return ExtensionUtils.loadMetadata(config.baseUrl,name).always(promise.resolve),promise.then(function(metadata){if(!metadata||!metadata.theme)return metadata.disabled?(new $.Deferred).reject("disabled").promise():loadExtensionModule(name,config,entryPoint)}).then(function(){exports.trigger(EVENT_EXTENSION_LOADED,config.baseUrl)},function(err){"disabled"===err?exports.trigger(EVENT_EXTENSION_DISABLED,config.baseUrl):exports.trigger(EVENT_EXTENSION_LOAD_FAILED,config.baseUrl)})}function _testExtensionByURL(name,config,entryPoint){var result=new $.Deferred;try{var extensionRequire;brackets.libRequire.config({context:name,baseUrl:config.baseUrl,paths:$.extend({},config.paths,globalPaths),waitSeconds:EXTENSION_LOAD_TIMOUT_SECONDS})([entryPoint],function(){console.log("Test extension loaded: ",name),result.resolve()},function(err){console.log("Unit tests not found for:",name,err),result.reject()})}catch(e){console.error("Test extension load failed: ",name,e),result.resolve()}return result.promise()}function testExtension(name,config,entryPoint){var result=new $.Deferred,extensionPath=config.baseUrl+"/"+entryPoint+".js";return extensionPath.startsWith("http://")||extensionPath.startsWith("https://")?_testExtensionByURL(name,config,entryPoint):(FileSystem.resolve(extensionPath,function(err,entry){var extensionRequire;!err&&entry.isFile?brackets.libRequire.config({context:name,baseUrl:config.baseUrl,paths:$.extend({},config.paths,globalPaths)})([entryPoint],function(){result.resolve()}):result.reject()}),result.promise())}function _loadAll(directory,config,entryPoint,processExtension){var result=new $.Deferred;return FileSystem.getDirectoryForPath(directory).getContents(function(err,contents){if(err)console.error("[Extension] Error -- could not read native directory: "+directory),result.reject();else{var i,extensions=[];for(i=0;i<contents.length;i++)contents[i].isDirectory&&extensions.push(contents[i].name);if(0===extensions.length)return void result.resolve();Async.doInParallel(extensions,function(item){var extConfig={baseUrl:window.fsServerUrl.slice(0,-1)+config.baseUrl+"/"+item,paths:config.paths};return console.log("Loading Extension from virtual fs: ",extConfig),processExtension(item,extConfig,entryPoint)}).always(function(){result.resolve()})}}),result.promise()}function loadAllDefaultExtensions(){const extensionPath=getDefaultExtensionPath(),result=new $.Deferred;return Async.doInParallel(DefaultExtensionsList,function(extensionEntry){var extConfig;return logger.leaveTrail("loading default extension: "+extensionEntry),loadExtension(extensionEntry,{baseUrl:extensionPath+"/"+extensionEntry},"main")}).always(function(){result.resolve()}),result.promise()}function loadAllExtensionsInNativeDirectory(directory){return _loadAll(directory,{baseUrl:directory},"main",loadExtension)}function testAllExtensionsInNativeDirectory(directory){var result=new $.Deferred,virtualServerURL=window.fsServerUrl,extensionsDir=_getExtensionPath()+"/"+directory,config={baseUrl:virtualServerURL+extensionsDir};return config.paths={perf:virtualServerURL+"/test/perf",spec:virtualServerURL+"/test/spec"},FileSystem.getDirectoryForPath(extensionsDir).getContents(function(err,contents){if(err)console.error("[Extension Load Test] Error -- could not read native directory: "+directory),result.reject();else{var i,extensions=[];for(i=0;i<contents.length;i++)contents[i].isDirectory&&extensions.push(contents[i].name);if(0===extensions.length)return void result.resolve();Async.doInParallel(extensions,function(extensionName){let loadResult=new $.Deferred;var extConfig={basePath:"extensions/default",baseUrl:config.baseUrl+"/"+extensionName,paths:config.paths};return console.log("Loading Extension Test from virtual fs: ",extConfig),_testExtensionByURL(extensionName,extConfig,"unittests").always(function(){console.log("tested",extensionName),loadResult.resolve()}),loadResult.promise()}).always(function(){result.resolve()})}}),result.promise()}function testAllDefaultExtensions(){const bracketsPath=FileUtils.getNativeBracketsDirectoryPath(),href=window.location.href,baseUrl=href.substring(0,href.lastIndexOf("/")),srcBaseUrl=new URL(baseUrl+"/../src").href;var result=new $.Deferred;return Async.doInParallel(DefaultExtensionsList,function(extensionEntry){const loadResult=new $.Deferred,extConfig={basePath:"extensions/default",baseUrl:new URL(srcBaseUrl+DEFAULT_EXTENSIONS_PATH_BASE+"/"+extensionEntry).href,paths:{perf:bracketsPath+"/perf",spec:bracketsPath+"/spec"}};return console.log("Testing default extension: ",extensionEntry),_testExtensionByURL(extensionEntry,extConfig,"unittests").always(function(){console.log("load complete",extensionEntry),loadResult.resolve()}),loadResult.promise()}).always(function(){result.resolve()}),result.promise()}function init(paths){var params=new UrlParams;if(_init)return(new $.Deferred).resolve().promise();paths||(params.parse(),paths="true"!==params.get("reloadWithoutUserExts")?["default",getUserExtensionPath(),getDevExtensionPath()]:[]);var extensionPath=getUserExtensionPath();FileSystem.getDirectoryForPath(extensionPath).create(),FileSystem.getDirectoryForPath(getDevExtensionPath()).create();var disabledExtensionPath=extensionPath.replace(/\/user$/,"/disabled");FileSystem.getDirectoryForPath(disabledExtensionPath).create();var promise=Async.doInParallel(paths,function(extPath){return"default"===extPath?loadAllDefaultExtensions():loadAllExtensionsInNativeDirectory(extPath)},!1);return promise.always(function(){_init=!0}),promise}EventDispatcher.makeEventDispatcher(exports),exports._setInitExtensionTimeout=_setInitExtensionTimeout,exports._getInitExtensionTimeout=_getInitExtensionTimeout,exports.init=init,exports.getDefaultExtensionPath=getDefaultExtensionPath,exports.getUserExtensionPath=getUserExtensionPath,exports.getRequireContextForExtension=getRequireContextForExtension,exports.loadExtension=loadExtension,exports.testExtension=testExtension,exports.loadAllExtensionsInNativeDirectory=loadAllExtensionsInNativeDirectory,exports.testAllExtensionsInNativeDirectory=testAllExtensionsInNativeDirectory,exports.testAllDefaultExtensions=testAllDefaultExtensions,exports.EVENT_EXTENSION_LOADED=EVENT_EXTENSION_LOADED,exports.EVENT_EXTENSION_DISABLED=EVENT_EXTENSION_DISABLED,exports.EVENT_EXTENSION_LOAD_FAILED=EVENT_EXTENSION_LOAD_FAILED});
//# sourceMappingURL=ExtensionLoader.js.map
