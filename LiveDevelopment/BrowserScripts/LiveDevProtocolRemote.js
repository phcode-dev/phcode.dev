!function(global){var transport=global._Brackets_LiveDev_Transport,MessageBroker={handlers:{},trigger:function(msg){var msgHandlers;msg.method?(msgHandlers=this.handlers[msg.method])&&msgHandlers.length>0?msgHandlers.forEach(function(handler){try{return void handler(msg)}catch(e){return void console.error("[Brackets LiveDev] Error executing a handler for "+msg.method,e.stack)}}):console.warn("[Brackets LiveDev] No subscribers for message "+msg.method):console.error("[Brackets LiveDev] Received message without method.")},respond:function(orig,response){orig.id?(response.id=orig.id,this.send(response)):console.error("[Brackets LiveDev] Trying to send a response for a message with no ID")},on:function(method,handler){method&&handler&&(this.handlers[method]||(this.handlers[method]=[]),this.handlers[method].push(handler))},send:function(msgStr){transport.send(JSON.stringify(msgStr))}},Runtime={evaluate:function(msg){var result=eval(msg.params.expression);MessageBroker.respond(msg,{result:JSON.stringify(result)})}};MessageBroker.on("Runtime.evaluate",Runtime.evaluate);var CSS={setStylesheetText:function(msg){if(msg&&msg.params&&msg.params.text&&msg.params.url){var i,node,head=window.document.getElementsByTagName("head")[0],s=window.document.createElement("style");for(s.type="text/css",s.appendChild(window.document.createTextNode(msg.params.text)),i=0;i<window.document.styleSheets.length;i++)(node=window.document.styleSheets[i]).ownerNode.id===msg.params.url?(head.insertBefore(s,node.ownerNode),node.ownerNode.parentNode.removeChild(node.ownerNode)):node.href!==msg.params.url||node.disabled||(head.insertBefore(s,node.ownerNode),node.disabled=!0,i++);s.id=msg.params.url}},getStylesheetText:function(msg){var i,sheet,text="";for(i=0;i<window.document.styleSheets.length;i++)if((sheet=window.document.styleSheets[i]).ownerNode.id===msg.params.url)text=sheet.ownerNode.textContent;else if(sheet.href===msg.params.url&&!sheet.disabled){var j,rules;try{rules=window.document.styleSheets[i].cssRules}catch(e){if("SecurityError"!==e.name)throw e}if(!rules)return;for(j=0;j<rules.length;j++)text+=rules[j].cssText+"\n"}MessageBroker.respond(msg,{text:text})}};MessageBroker.on("CSS.setStylesheetText",CSS.setStylesheetText),MessageBroker.on("CSS.getStylesheetText",CSS.getStylesheetText);var Page={reload:function(msg){window.location.reload(msg.params.ignoreCache)},navigate:function(msg){msg.params.url&&window.location.replace(msg.params.url)}};if(MessageBroker.on("Page.reload",Page.reload),MessageBroker.on("Page.navigate",Page.navigate),MessageBroker.on("ConnectionClose",Page.close),transport){var ProtocolManager={_documentObserver:{},_protocolHandler:{},enable:function(){transport.setCallbacks(this._protocolHandler),transport.enable()},onConnect:function(){this._documentObserver.start(window.document,transport)},onClose:function(){var body=window.document.getElementsByTagName("body")[0],overlay=window.document.createElement("div"),background=window.document.createElement("div"),status=window.document.createElement("div");overlay.style.width="100%",overlay.style.height="100%",overlay.style.zIndex=2227,overlay.style.position="fixed",overlay.style.top=0,overlay.style.left=0,background.style.backgroundColor="#fff",background.style.opacity=.5,background.style.width="100%",background.style.height="100%",background.style.position="fixed",background.style.top=0,background.style.left=0,status.textContent="Live Development Session has Ended",status.style.width="100%",status.style.color="#fff",status.style.backgroundColor="#666",status.style.position="fixed",status.style.top=0,status.style.left=0,status.style.padding="0.2em",status.style.verticalAlign="top",status.style.textAlign="center",overlay.appendChild(background),overlay.appendChild(status),body.appendChild(overlay),window.document.title="(Brackets Live Preview: closed) "+window.document.title},setDocumentObserver:function(documentOberver){documentOberver&&(this._documentObserver=documentOberver)},setProtocolHandler:function(protocolHandler){protocolHandler&&(this._protocolHandler=protocolHandler)}};global._Brackets_LiveDev_ProtocolManager=ProtocolManager;var ProtocolHandler={message:function(msgStr){var msg;try{msg=JSON.parse(msgStr)}catch(e){return void console.error("[Brackets LiveDev] Malformed message received: ",msgStr)}MessageBroker.trigger(msg)},close:function(evt){ProtocolManager.onClose()},connect:function(evt){ProtocolManager.onConnect()}};ProtocolManager.setProtocolHandler(ProtocolHandler),window.addEventListener("load",function(){ProtocolManager.enable()}),window.document.addEventListener("click",onDocumentClick)}else console.error("[Brackets LiveDev] No transport set");function onDocumentClick(event){var element=event.target;element&&element.hasAttribute("data-brackets-id")&&MessageBroker.send({tagId:element.getAttribute("data-brackets-id")})}}(this);
//# sourceMappingURL=LiveDevProtocolRemote.js.map
