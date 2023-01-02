define(function(require,exports,module){const LanguageManager=require("language/LanguageManager"),ProviderRegistrationHandler=require("features/PriorityBasedRegistration").RegistrationHandler,_providerRegistrationHandler=new ProviderRegistrationHandler,registerContentProvider=_providerRegistrationHandler.registerProvider.bind(_providerRegistrationHandler),removeContentProvider=_providerRegistrationHandler.removeProvider.bind(_providerRegistrationHandler);function _getContent(results,providerInfos){console.log(results,providerInfos);for(let i=0;i<results.length;i++){let result=results[i];if("fulfilled"===result.status&&result.value)return result.value}return""}async function getInitialContentForFile(fullPath){let language=LanguageManager.getLanguageForPath(fullPath),contentProviders=_providerRegistrationHandler.getProvidersForLanguageId(language.getId()),providerPromises=[],activeProviderInfos=[],results;for(let providerInfo of contentProviders){let provider=providerInfo.provider;provider.getContent?(providerPromises.push(provider.getContent(fullPath)),activeProviderInfos.push(providerInfo)):console.error("NewFileContentManager provider does not implement the required getContent function",provider)}return _getContent(await Promise.allSettled(providerPromises),activeProviderInfos)}exports.registerContentProvider=registerContentProvider,exports.removeContentProvider=removeContentProvider,exports.getInitialContentForFile=getInitialContentForFile});
//# sourceMappingURL=NewFileContentManager.js.map
