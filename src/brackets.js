define(function(require,exports,module){function _removePhoenixLoadingOverlay(){window.splashScreenPresent&&(document.getElementById("phoenix-loading-splash-screen-overlay").remove(),document.getElementById("safari_splash_screen").remove(),window.splashScreenPresent=!1)}require("widgets/bootstrap-dropdown"),require("widgets/bootstrap-modal"),require("widgets/bootstrap-twipsy-mod"),require("thirdparty/jquery.knob.modified"),require("thirdparty/marked.min"),require("thirdparty/CodeMirror/addon/comment/continuecomment"),require("thirdparty/CodeMirror/addon/edit/closebrackets"),require("thirdparty/CodeMirror/addon/edit/closetag"),require("thirdparty/CodeMirror/addon/edit/matchbrackets"),require("thirdparty/CodeMirror/addon/edit/matchtags"),require("thirdparty/CodeMirror/addon/fold/xml-fold"),require("thirdparty/CodeMirror/addon/mode/multiplex"),require("thirdparty/CodeMirror/addon/mode/overlay"),require("thirdparty/CodeMirror/addon/mode/simple"),require("thirdparty/CodeMirror/addon/scroll/scrollpastend"),require("thirdparty/CodeMirror/addon/search/match-highlighter"),require("thirdparty/CodeMirror/addon/search/searchcursor"),require("thirdparty/CodeMirror/addon/selection/active-line"),require("thirdparty/CodeMirror/addon/selection/mark-selection"),require("thirdparty/CodeMirror/keymap/sublime"),require("worker/WorkerComm"),require("utils/PhoenixComm");const AppInit=require("utils/AppInit"),LanguageManager=require("language/LanguageManager"),ProjectManager=require("project/ProjectManager"),FileViewController=require("project/FileViewController"),FileSyncManager=require("project/FileSyncManager"),Commands=require("command/Commands"),CommandManager=require("command/CommandManager"),PerfUtils=require("utils/PerfUtils"),FileSystem=require("filesystem/FileSystem"),Strings=require("strings"),Dialogs=require("widgets/Dialogs"),DefaultDialogs=require("widgets/DefaultDialogs"),ExtensionLoader=require("utils/ExtensionLoader"),ExtensionInterface=require("utils/ExtensionInterface"),EventManager=require("utils/EventManager"),FeatureGate=require("utils/FeatureGate"),Async=require("utils/Async"),UrlParams=require("utils/UrlParams").UrlParams,PreferencesManager=require("preferences/PreferencesManager"),DragAndDrop=require("utils/DragAndDrop"),NativeApp=require("utils/NativeApp"),DeprecationWarning=require("utils/DeprecationWarning"),ViewCommandHandlers=require("view/ViewCommandHandlers"),NotificationUI=require("widgets/NotificationUI"),MainViewManager=require("view/MainViewManager");window.EventManager=EventManager,window.ExtensionInterface=ExtensionInterface,window.FeatureGate=FeatureGate,window.Strings=Strings,window.NotificationUI=NotificationUI;const MainViewHTML=require("text!htmlContent/main-view.html");require("utils/Global"),require("editor/CSSInlineEditor"),require("project/WorkingSetSort"),require("search/QuickOpen"),require("search/QuickOpenHelper"),require("file/FileUtils"),require("project/SidebarView"),require("utils/Resizer"),require("LiveDevelopment/main"),require("utils/NodeConnection"),require("utils/NodeDomain"),require("utils/ColorUtils"),require("view/ThemeManager"),require("thirdparty/lodash"),require("language/XMLUtils"),require("language/JSONUtils"),require("widgets/InlineMenu"),require("thirdparty/tinycolor");const CodeMirror=require("thirdparty/CodeMirror/lib/codemirror");Object.defineProperty(window,"CodeMirror",{get:function(){return DeprecationWarning.deprecationWarning('Use brackets.getModule("thirdparty/CodeMirror/lib/codemirror") instead of global CodeMirror.',!0),CodeMirror}});const Mustache=require("thirdparty/mustache/mustache");Object.defineProperty(window,"Mustache",{get:function(){return DeprecationWarning.deprecationWarning('Use brackets.getModule("thirdparty/mustache/mustache") instead of global Mustache.',!0),Mustache}});const PathUtils=require("thirdparty/path-utils/path-utils");Object.defineProperty(window,"PathUtils",{get:function(){return DeprecationWarning.deprecationWarning('Use brackets.getModule("thirdparty/path-utils/path-utils") instead of global PathUtils.',!0),PathUtils}}),require("features/ParameterHintsManager"),require("features/JumpToDefManager"),require("features/QuickViewManager"),require("features/SelectionViewManager"),require("features/BeautificationManager"),require("features/NewFileContentManager"),require("command/DefaultMenus"),require("document/ChangedDocumentTracker"),require("editor/EditorCommandHandlers"),require("editor/EditorOptionHandlers"),require("editor/EditorStatusBar"),require("editor/ImageViewer"),require("extensibility/InstallExtensionDialog"),require("extensibility/ExtensionManagerDialog"),require("help/HelpCommandHandlers"),require("search/FindInFilesUI"),require("search/FindReplace"),require("features/FindReferencesManager"),require("JSUtils/Session"),require("JSUtils/ScopeManager"),require("languageTools/PathConverters"),require("languageTools/LanguageTools"),require("languageTools/ClientLoader"),require("languageTools/BracketsToNodeInterface"),require("languageTools/DefaultProviders"),require("languageTools/DefaultEventHandlers"),require("worker/IndexingWorker"),require("worker/ExtensionsWorker"),require("LiveDevelopment/Servers/FileServer"),require("LiveDevelopment/Servers/UserServer"),PerfUtils.addMeasurement("brackets module dependencies resolved");const params=new UrlParams;function _initTest(){brackets.test={BeautificationManager:require("features/BeautificationManager"),CodeHintManager:require("editor/CodeHintManager"),CodeInspection:require("language/CodeInspection"),CommandManager:require("command/CommandManager"),Commands:require("command/Commands"),CSSUtils:require("language/CSSUtils"),DefaultDialogs:require("widgets/DefaultDialogs"),Dialogs:require("widgets/Dialogs"),DocumentCommandHandlers:require("document/DocumentCommandHandlers"),DocumentManager:require("document/DocumentManager"),DocumentModule:require("document/Document"),DragAndDrop:require("utils/DragAndDrop"),EditorManager:require("editor/EditorManager"),EventManager:require("utils/EventManager"),ExtensionLoader:require("utils/ExtensionLoader"),ExtensionUtils:require("utils/ExtensionUtils"),ExtensionInterface:require("utils/ExtensionInterface"),FeatureGate:require("utils/FeatureGate"),File:require("filesystem/File"),FileFilters:require("search/FileFilters"),FileSyncManager:require("project/FileSyncManager"),FileSystem:require("filesystem/FileSystem"),FileUtils:require("file/FileUtils"),FileViewController:require("project/FileViewController"),FindInFiles:require("search/FindInFiles"),FindInFilesUI:require("search/FindInFilesUI"),FindUtils:require("search/FindUtils"),HTMLInstrumentation:require("LiveDevelopment/MultiBrowserImpl/language/HTMLInstrumentation"),InstallExtensionDialog:require("extensibility/InstallExtensionDialog"),JSUtils:require("language/JSUtils"),KeyBindingManager:require("command/KeyBindingManager"),LanguageManager:require("language/LanguageManager"),LiveDevMultiBrowser:require("LiveDevelopment/LiveDevMultiBrowser"),LiveDevServerManager:require("LiveDevelopment/LiveDevServerManager"),MainViewFactory:require("view/MainViewFactory"),MainViewManager:require("view/MainViewManager"),Menus:require("command/Menus"),MultiRangeInlineEditor:require("editor/MultiRangeInlineEditor").MultiRangeInlineEditor,NativeApp:require("utils/NativeApp"),PerfUtils:require("utils/PerfUtils"),PhoenixComm:require("utils/PhoenixComm"),PreferencesManager:require("preferences/PreferencesManager"),ProjectManager:require("project/ProjectManager"),QuickViewManager:require("features/QuickViewManager"),SelectionViewManager:require("features/SelectionViewManager"),WorkspaceManager:require("view/WorkspaceManager"),SearchResultsView:require("search/SearchResultsView"),ScrollTrackMarkers:require("search/ScrollTrackMarkers"),WorkingSetView:require("project/WorkingSetView"),doneLoading:!1},AppInit.appReady(function(){brackets.test.doneLoading=!0})}function _onReady(){PerfUtils.addMeasurement("window.document Ready");const osxMatch=/Mac OS X 10\D([\d+])\D/.exec(window.navigator.userAgent);if(osxMatch&&osxMatch[1]&&Number(osxMatch[1])>=7){const $testDiv=$("<div style='position:fixed;left:-50px;width:50px;height:50px;overflow:auto;'><div style='width:100px;height:100px;'/></div>").appendTo(window.document.body);$testDiv.outerWidth()===$testDiv.get(0).clientWidth&&$(".sidebar").removeClass("quiet-scrollbars"),$testDiv.remove()}Async.waitForAll([LanguageManager.ready,PreferencesManager.ready]).always(function(){const extensionPathOverride=params.get("extensions"),extensionLoaderPromise=ExtensionLoader.init(extensionPathOverride?extensionPathOverride.split(","):null);ViewCommandHandlers.restoreFontSize(),ProjectManager.getStartupProjectPath().then(initialProjectPath=>{ProjectManager.openProject(initialProjectPath).always(function(){_initTest();const deferred=new $.Deferred;params.get("skipSampleProjectLoad")||PreferencesManager.getViewState("afterFirstLaunch")?deferred.resolve():(PreferencesManager.setViewState("afterFirstLaunch","true"),ProjectManager.isWelcomeProjectPath(initialProjectPath)?FileSystem.resolve(initialProjectPath+"index.html",function(err,file){if(err)deferred.reject();else{const promise=CommandManager.execute(Commands.CMD_ADD_TO_WORKINGSET_AND_OPEN,{fullPath:file.fullPath});promise.then(deferred.resolve,deferred.reject)}}):deferred.resolve()),deferred.always(function(){extensionLoaderPromise.always(function(){if(AppInit._dispatchReady(AppInit.EXTENSIONS_LOADED),AppInit._dispatchReady(AppInit.APP_READY),_removePhoenixLoadingOverlay(),PerfUtils.addMeasurement("Application Startup"),PreferencesManager._isUserScopeCorrupt()){const userPrefFullPath=PreferencesManager.getUserPrefFile(),info=MainViewManager.findInAllWorkingSets(userPrefFullPath);let paneId;info.length&&(paneId=info[0].paneId),FileViewController.openFileAndAddToWorkingSet(userPrefFullPath,paneId).done(function(){Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR,Strings.ERROR_PREFS_CORRUPT_TITLE,Strings.ERROR_PREFS_CORRUPT).done(function(){MainViewManager.focusActivePane()})})}})}),brackets.app.getPendingFilesToOpen&&brackets.app.getPendingFilesToOpen(function(err,paths){DragAndDrop.openDroppedFiles(paths)})})})})}function _beforeHTMLReady(){$("body").addClass("platform-"+brackets.platform),brackets.inBrowser?$("body").addClass("in-browser"):$("body").addClass("in-appshell"),function(){const defaultFocus=$.fn.focus;$.fn.focus=function(){if(!this.hasClass("dropdown-toggle"))return defaultFocus.apply(this,arguments)}}(),$("body").append(Mustache.render(MainViewHTML,{shouldAddAA:"mac"===brackets.platform,Strings:Strings})),$("title").text(brackets.config.app_title),DragAndDrop.attachHandlers(),$(window).focus(function(){FileSyncManager.syncOpenDocuments()}),$("html").on("mousedown",".inline-widget",function(e){1===e.button&&e.preventDefault()}),$("html").on("mousedown",".no-focus",function(e){const $target=$(e.target),isFormElement=$target.is("input")||$target.is("textarea")||$target.is("select");isFormElement||e.preventDefault()}),window.document.body.addEventListener("click",function(e){let node=e.target,url;for(;node;){if("A"===node.tagName){(url=node.getAttribute("href"))&&!url.match(/^#/)&&NativeApp.openURLInDefaultBrowser(url),e.preventDefault();break}node=node.parentElement}},!0);const DefaultCtor=jQuery.fn.init;jQuery.fn.init=function(firstArg,secondArg){const jQObject=new DefaultCtor(firstArg,secondArg);return firstArg&&firstArg._EventDispatcher&&(jQObject.on=firstArg.on.bind(firstArg),jQObject.one=firstArg.one.bind(firstArg),jQObject.off=firstArg.off.bind(firstArg),DeprecationWarning.deprecationWarning("Deprecated: Do not use $().on/off() on Brackets modules and model objects. Call on()/off() directly on the object without a $() wrapper.",!0,4)),jQObject}}params.parse(),ProjectManager.on(ProjectManager.EVENT_PROJECT_OPEN_FAILED,function(){_removePhoenixLoadingOverlay()});const viewStateTimer=PerfUtils.markStart("User viewstate loading");PreferencesManager._smUserScopeLoading.always(function(){PerfUtils.addMeasurement(viewStateTimer),_beforeHTMLReady(),AppInit._dispatchReady(AppInit.HTML_READY),$(window.document).ready(_onReady)})});
//# sourceMappingURL=brackets.js.map
