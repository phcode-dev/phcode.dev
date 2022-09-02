define(function(require,exports,module){const EditorManager=brackets.getModule("editor/EditorManager"),ScopeManager=brackets.getModule("JSUtils/ScopeManager"),Session=brackets.getModule("JSUtils/Session"),MessageIds=JSON.parse(brackets.getModule("text!JSUtils/MessageIds.json")),TokenUtils=brackets.getModule("utils/TokenUtils"),Strings=brackets.getModule("strings"),Editor=brackets.getModule("editor/Editor").Editor,ProjectManager=brackets.getModule("project/ProjectManager");let session=null,keywords=["define","alert","exports","require","module","arguments"];const MARK_TYPE_RENAME="renameVar";function initializeSession(editor){session=new Session(editor)}function getRefs(fileInfo,offset){return ScopeManager.postMessage({type:MessageIds.TERN_REFS,fileInfo:fileInfo,offset:offset}),ScopeManager.addPendingRequest(fileInfo.name,offset,MessageIds.TERN_REFS)}function requestFindRefs(session,document,offset){if(!document||!session)return;let path=document.file.fullPath,fileInfo,ternPromise;return{promise:getRefs({type:MessageIds.TERN_FILE_INFO_TYPE_FULL,name:path,offsetLines:0,text:ScopeManager.filterText(session.getJavascriptText())},offset)}}function handleRename(){let editor=EditorManager.getActiveEditor(),offset,token;if(!editor)return;if(editor.getSelections().length>1)return void editor.displayErrorMessageAtCursor(Strings.ERROR_RENAME_MULTICURSOR);if(initializeSession(editor),!editor||"javascript"!==editor.getModeForSelection())return;if(token=TokenUtils.getTokenAt(editor._codeMirror,editor._codeMirror.posFromIndex(session.getOffset())),keywords.indexOf(token.string)>=0)return void editor.displayErrorMessageAtCursor(Strings.ERROR_RENAME_GENERAL);let result=new $.Deferred;function isInSameFile(obj,refsResp){let projectRoot=ProjectManager.getProjectRoot(),projectDir,fileName="";return projectRoot&&(projectDir=projectRoot.fullPath),projectDir&&refsResp&&refsResp.file&&0===refsResp.file.indexOf(projectDir)&&(fileName=refsResp.file.slice(projectDir.length)),obj&&(obj.file===refsResp.file||obj.file===fileName||obj.file===refsResp.file.slice(1,refsResp.file.length))}function _multiFileRename(refs){}function _outlineText(currentEditor){let selections;if(currentEditor.getSelections().length>1){let primary=currentEditor.getSelection();currentEditor.markText(MARK_TYPE_RENAME,primary.start,primary.end,Editor.MARK_OPTION_RENAME_OUTLINE),currentEditor.off(Editor.EVENT_BEFORE_SELECTION_CHANGE+".renameVar"),currentEditor.on(Editor.EVENT_BEFORE_SELECTION_CHANGE+".renameVar",function(_evt,newSelections){newSelections.ranges&&1===newSelections.ranges.length&&(currentEditor.clearAllMarks(MARK_TYPE_RENAME),currentEditor.off(Editor.EVENT_BEFORE_SELECTION_CHANGE+".renameVar"))})}}function handleFindRefs(refsResp){if(!refsResp||!refsResp.references||!refsResp.references.refs)return;let inlineWidget=EditorManager.getFocusedInlineWidget(),editor=EditorManager.getActiveEditor(),refs=refsResp.references.refs;if(inlineWidget){let isInTextRange;if(!!refs.find(function(item){return item.start.line<inlineWidget._startLine||item.end.line>inlineWidget._endLine}))return void editor.displayErrorMessageAtCursor(Strings.ERROR_RENAME_QUICKEDIT)}let currentPosition=editor.posFromIndex(refsResp.offset),refsArray,primaryRef;(refsArray=refs.filter(function(element){return isInSameFile(element,refsResp)})).length===refs.length&&(refsArray.find(function(element){return(element.start.line===currentPosition.line||element.end.line===currentPosition.line)&&currentPosition.ch<=element.end.ch&&currentPosition.ch>=element.start.ch}).primary=!0,editor.setSelections(refsArray),_outlineText(editor))}function requestFindReferences(session,offset){let response=requestFindRefs(session,session.editor.document,offset);response&&response.hasOwnProperty("promise")&&response.promise.done(handleFindRefs).fail(function(errorMsg){EditorManager.getActiveEditor().displayErrorMessageAtCursor(errorMsg),result.reject()})}return offset=session.getOffset(),requestFindReferences(session,offset),result.promise()}exports._MARK_TYPE_RENAME=MARK_TYPE_RENAME,exports.handleRename=handleRename});
//# sourceMappingURL=RenameIdentifier.js.map
