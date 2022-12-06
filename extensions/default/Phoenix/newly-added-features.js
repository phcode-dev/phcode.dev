define(function(require,exports,module){const CommandManager=brackets.getModule("command/CommandManager"),Commands=brackets.getModule("command/Commands"),Dialogs=brackets.getModule("widgets/Dialogs"),DefaultDialogs=brackets.getModule("widgets/DefaultDialogs"),Strings=brackets.getModule("strings"),NEW_FEATURE_MARKDOWN_SHOWN_HASH="Newly_added_features.md.shown.hash";function _getUpdateMarkdownPath(){return Phoenix.baseURL+"assets/default-project/en/Newly_added_features.md"}async function _digestMessage(message){const msgUint8=(new TextEncoder).encode(message),hashBuffer=await crypto.subtle.digest("SHA-256",msgUint8),hashArray=Array.from(new Uint8Array(hashBuffer)),hashHex=hashArray.map(b=>b.toString(16).padStart(2,"0")).join("");return hashHex}async function _getUpdateMarkdownText(){return new Promise((resolve,reject)=>{fetch(_getUpdateMarkdownPath()).then(response=>response.text()).then(async function(text){resolve(text)}).catch(reject)})}async function _setUpdateShown(){let markdownText=await _getUpdateMarkdownText();const hash=await _digestMessage(markdownText);localStorage.setItem(NEW_FEATURE_MARKDOWN_SHOWN_HASH,hash)}function _showNewFeatureMarkdownDoc(){setTimeout(()=>{CommandManager.execute(Commands.FILE_OPEN,{fullPath:_getUpdateMarkdownPath()})},3e3)}function _showReloadForUpdateDialog(){setTimeout(()=>{window.Phoenix.updatePendingReload&&Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO,Strings.UPDATE_AVAILABLE_TITLE,Strings.UPDATE_RELOAD_APP)},5e3)}async function _showNewUpdatesIfPresent(){let markdownText=await _getUpdateMarkdownText();const hash=await _digestMessage(markdownText),lastShownHash=localStorage.getItem(NEW_FEATURE_MARKDOWN_SHOWN_HASH);hash!==lastShownHash&&(_showNewFeatureMarkdownDoc(),await _setUpdateShown()),_showReloadForUpdateDialog()}exports.init=function(){Phoenix.firstBoot||window.testEnvironment?_setUpdateShown():_showNewUpdatesIfPresent()}});
//# sourceMappingURL=newly-added-features.js.map
