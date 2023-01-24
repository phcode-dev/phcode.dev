define(function(require,exports,module){const _=require("thirdparty/lodash"),EventDispatcher=require("utils/EventDispatcher"),FileSystem=require("filesystem/FileSystem"),FileUtils=require("file/FileUtils"),EditorManager=require("editor/EditorManager"),ExtensionUtils=require("utils/ExtensionUtils"),ThemeSettings=require("view/ThemeSettings"),ThemeView=require("view/ThemeView"),PreferencesManager=require("preferences/PreferencesManager"),prefs=PreferencesManager.getExtensionPrefs("themes");let loadedThemes={},currentTheme=null,styleNode=$(ExtensionUtils.addEmbeddedStyleSheet("")),commentRegex=/\/\*([\s\S]*?)\*\//gm,scrollbarsRegex=/((?:[^}|,]*)::-webkit-scrollbar(?:[^{]*)[{](?:[^}]*?)[}])/gim,stylesPath=FileUtils.getNativeBracketsDirectoryPath()+"/styles/";const EVENT_THEME_CHANGE="themeChange";function toDisplayName(name){var extIndex=name.lastIndexOf(".");return(name=name.substring(0,-1!==extIndex?extIndex:void 0).replace(/-/g," ")).split(" ").map(function(part){return part[0].toUpperCase()+part.substring(1)}).join(" ")}function Theme(file,options){options=options||{};var fileName=file.name;options.name||(options.title?options.name=options.title:options.name=FileUtils.getFilenameWithoutExtension(fileName).replace(/\.min$/,""),options.name=options.name.toLocaleLowerCase().replace(/[\W]/g,"-")),this.file=file,this.name=options.name,this.displayName=options.title||toDisplayName(fileName),this.dark=void 0!==options.theme&&!0===options.theme.dark,this.addModeClass=void 0!==options.theme&&!0===options.theme.addModeClass}function extractScrollbars(content){var scrollbar=[];return{content:content=content.replace(scrollbarsRegex,function(match){return scrollbar.push(match),""}),scrollbar:scrollbar}}function fixPath(path){return path.replace(/^([A-Z]+:)?\//,function(match){return match.toLocaleLowerCase()})}function lessifyTheme(content,theme){var deferred=new $.Deferred;return less.render("#editor-holder, .editor-holder {"+content+"\n}",{rootpath:fixPath(stylesPath),filename:fixPath(theme.file._path)},function(err,tree){err?deferred.reject(err):deferred.resolve(tree.css)}),deferred.promise()}function getThemeByFile(file){var path=file._path;return _.find(loadedThemes,function(item){return item.file._path===path})}function getCurrentTheme(){let defaultTheme=isOSInDarkTheme()?ThemeSettings.DEFAULTS.darkTheme:ThemeSettings.DEFAULTS.lightTheme;return currentTheme||(currentTheme=loadedThemes[prefs.get("theme")]||loadedThemes[defaultTheme]),currentTheme}function getAllThemes(){return _.map(loadedThemes,function(theme){return theme})}function loadCurrentTheme(){var theme=getCurrentTheme(),pending=theme&&FileUtils.readAsText(theme.file).then(function(lessContent){return lessifyTheme(lessContent.replace(commentRegex,""),theme)}).then(function(content){var result=extractScrollbars(content);return theme.scrollbar=result.scrollbar,result.content}).then(function(cssContent){return $("body").toggleClass("dark",theme.dark),styleNode.text(cssContent),theme});return $.when(pending)}function refresh(force){force&&(currentTheme=null),$.when(force&&loadCurrentTheme()).done(function(){var editor=EditorManager.getActiveEditor();if(editor&&editor._codeMirror){var cm=editor._codeMirror;ThemeView.updateThemes(cm),cm.setOption("addModeClass",!(!currentTheme||!currentTheme.addModeClass))}})}function _loadThemeFromFile(file,options){let theme=new Theme(file,options);return loadedThemes[theme.name]=theme,ThemeSettings._setThemes(loadedThemes),getCurrentTheme()&&getCurrentTheme().name===theme.name&&refresh(!0),theme}function _copyPackageJson(packageURL,destPackageFilePath){return new Promise((resolve,reject)=>{const file=FileSystem.getFileForPath(destPackageFilePath);file.exists(function(err,exists){err?reject():exists?resolve():$.get(packageURL).done(function(packageContent){FileUtils.writeText(file,JSON.stringify(packageContent),!0).done(function(){resolve()}).fail(function(err){reject(err)})}).fail(function(err){reject(err)})})})}function _loadFileFromURL(url,options){let deferred=new $.Deferred;const themeName=options.name||options.theme.title,fileName=options.theme.file||("string"==typeof options.theme?options.theme:"theme.css"),themeFolder=brackets.app.getApplicationSupportDirectory()+`/extensions/user/${themeName}/`,packageURL=url.substring(0,url.lastIndexOf("/"))+"/package.json",packagePath=path.normalize(themeFolder+"package.json"),themePath=path.normalize(themeFolder+fileName),file=FileSystem.getFileForPath(themePath),folder=FileSystem.getDirectoryForPath(themeFolder);return $.get(url).done(function(themeContent){folder.create(err=>{if(err)return console.error(err),void deferred.reject();FileUtils.writeText(file,themeContent,!0).done(function(){_copyPackageJson(packageURL,packagePath).catch(error=>{console.error("Error copying package.json for theme "+themePath,error)}).finally(()=>{let theme=_loadThemeFromFile(file,options);deferred.resolve(theme)})}).fail(function(error){console.error("Error writing "+themePath,error),deferred.reject()})})}).fail(function(){file.exists(function(err,exists){if(err)deferred.reject(err);else if(exists){let theme=_loadThemeFromFile(file,options);deferred.resolve(theme)}else;})}),deferred.promise()}function loadFile(fileName,options){if(fileName.startsWith("http://")||fileName.startsWith("https://"))return _loadFileFromURL(fileName,options);var deferred=new $.Deferred,file=FileSystem.getFileForPath(fileName);return file.exists(function(err,exists){var theme;exists?(theme=new Theme(file,options),loadedThemes[theme.name]=theme,ThemeSettings._setThemes(loadedThemes),currentTheme&&currentTheme.name===theme.name&&refresh(!0),deferred.resolve(theme)):!err&&exists||deferred.reject(err)}),deferred.promise()}function loadPackage(themePackage){var fileName;return loadFile(themePackage.path+"/"+themePackage.metadata.theme.file,themePackage.metadata)}function isOSInDarkTheme(){if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)return!0}function setCurrentTheme(themeID){let themeIDs=[];for(let theme of getAllThemes())themeIDs.push(theme.name);return themeIDs.includes(themeID)?(prefs.set("theme",themeID),!0):(console.error("Cannot set theme that doesnt exist: ",themeID),!1)}window.matchMedia("(prefers-color-scheme: dark)").addListener(function(e){console.log(`System theme changed to ${e.matches?"dark":"light"} mode`),refresh(!0),exports.trigger("themeChange",getCurrentTheme())}),prefs.on("change","theme",function(){currentTheme&&currentTheme.name===prefs.get("theme")||(refresh(!0),ThemeView.updateScrollbars(getCurrentTheme()),exports.trigger("themeChange",getCurrentTheme()))}),prefs.on("change","themeScrollbars",function(){refresh(),ThemeView.updateScrollbars(getCurrentTheme())}),FileSystem.on("change",function(evt,file){file&&!file.isDirectory&&getThemeByFile(file)&&refresh(!0)}),EditorManager.on("activeEditorChange",function(){refresh()}),EventDispatcher.makeEventDispatcher(exports),exports.refresh=refresh,exports.loadFile=loadFile,exports.loadPackage=loadPackage,exports.getCurrentTheme=getCurrentTheme,exports.getAllThemes=getAllThemes,exports.isOSInDarkTheme=isOSInDarkTheme,exports.setCurrentTheme=setCurrentTheme,exports.EVENT_THEME_CHANGE="themeChange",exports._toDisplayName=toDisplayName,exports._extractScrollbars=extractScrollbars});
//# sourceMappingURL=ThemeManager.js.map
