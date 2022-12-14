define(function(require,exports,module){var PreferencesManager=require("preferences/PreferencesManager");function _providerSort(a,b){return b.priority-a.priority}function RegistrationHandler(){this._providers={all:[]}}RegistrationHandler.prototype.registerProvider=function(providerInfo,languageIds,priority){var providerObj={provider:providerInfo,priority:priority||0},self=this;languageIds.forEach(function(languageId){self._providers[languageId]||(self._providers[languageId]=[]),self._providers[languageId].push(providerObj),self._providers[languageId].sort(_providerSort)})},RegistrationHandler.prototype.removeProvider=function(provider,targetLanguageId){var index,providers,targetLanguageIdArr,self=this;(targetLanguageIdArr=Array.isArray(targetLanguageId)?targetLanguageId:targetLanguageId?[targetLanguageId]:Object.keys(self._providers)).forEach(function(languageId){for(providers=self._providers[languageId],index=0;index<providers.length;index++)if(providers[index].provider===provider){providers.splice(index,1);break}})},RegistrationHandler.prototype.getProvidersForLanguageId=function(languageId){var providers;return(this._providers[languageId]||[]).concat(this._providers.all||[]).sort(_providerSort).filter(function(provider){var prefKey="tooling."+provider.provider.constructor.name;return!1!==PreferencesManager.get(prefKey)})},exports.RegistrationHandler=RegistrationHandler});
//# sourceMappingURL=PriorityBasedRegistration.js.map
