define(function(require,exports,module){const WorkspaceManager=require("view/WorkspaceManager"),Mustache=require("thirdparty/mustache/mustache"),ToastPopupHtml=require("text!widgets/html/toast-popup.html"),Dialogs=require("widgets/Dialogs"),MainViewManager=require("view/MainViewManager"),NOTIFICATION_TYPE_ARROW="arrow",NOTIFICATION_TYPE_TOAST="toast",CLOSE_REASON={TIMEOUT:"closeTimeout",CLICK_DISMISS:"clickDismiss",CLOSE_BTN_CLICK:"closeBtnClick"};function Notification($notification,type){this.$notification=$notification,this.type=type,this._result=new $.Deferred,this._promise=this._result.promise()}function _closeToastNotification($NotificationPopup,endCB){function cleanup(){$NotificationPopup.removeClass("animateClose"),$NotificationPopup.remove(),endCB&&endCB()}$NotificationPopup.removeClass("animateOpen"),$NotificationPopup.addClass("animateClose").one("transitionend",cleanup).one("transitioncancel",cleanup)}function _closeArrowNotification($NotificationPopup,endCB){function cleanup(){$NotificationPopup.remove(),WorkspaceManager.off(WorkspaceManager.EVENT_WORKSPACE_UPDATE_LAYOUT,$NotificationPopup[0].update),endCB&&endCB()}$NotificationPopup.removeClass("notification-ui-visible").addClass("notification-ui-hidden").one("transitionend",cleanup).one("transitioncancel",cleanup)}function createFromTemplate(template,elementID,options={}){options.allowedPlacements=options.allowedPlacements||["top","bottom","left","right"],options.dismissOnClick=void 0===options.dismissOnClick||options.dismissOnClick,elementID||(elementID="notificationUIDefaultAnchor");const tooltip=_createDomElementWithArrowElement(template,elementID,options);tooltip.addClass("notification-ui-visible");let notification=new Notification(tooltip,NOTIFICATION_TYPE_ARROW);return options.autoCloseTimeS&&setTimeout(()=>{notification.close(CLOSE_REASON.TIMEOUT)},1e3*options.autoCloseTimeS),options.dismissOnClick&&tooltip.click(()=>{notification.close(CLOSE_REASON.CLICK_DISMISS)}),notification}Notification.prototype.close=function(closeType){let self=this,$notification=this.$notification;if(!$notification)return this;function doneCB(){self._result.resolve(closeType)}return this.$notification=null,this.type===NOTIFICATION_TYPE_TOAST?_closeToastNotification($notification,doneCB):_closeArrowNotification($notification,doneCB),this},Notification.prototype.done=function(callback){this._promise.done(callback)};let notificationWidgetCount=0;function _computePlacementWithArrowElement(tooltip,arrowElement,{x:x,y:y,placement:placement,middlewareData:middlewareData}){if(Object.assign(tooltip.style,{left:`${x}px`,top:`${y}px`}),arrowElement){const{x:arrowX,y:arrowY}=middlewareData.arrow,staticSide={top:"bottom",right:"left",bottom:"top",left:"right"}[placement.split("-")[0]];Object.assign(arrowElement.style,{left:null!=arrowX?`${arrowX}px`:"",top:null!=arrowY?`${arrowY}px`:"",right:"",bottom:"",[staticSide]:"-4px"})}}function _updatePositions(tooltip,onElement,arrowElement,options){let middleWare=[FloatingUIDOM.offset(6),FloatingUIDOM.autoPlacement({allowedPlacements:options.allowedPlacements}),FloatingUIDOM.shift({padding:5})];arrowElement&&middleWare.push(FloatingUIDOM.arrow({element:arrowElement})),tooltip.update=function(){FloatingUIDOM.computePosition(onElement,tooltip,{placement:"top",middleware:middleWare}).then(({x:x,y:y,placement:placement,middlewareData:middlewareData})=>{_computePlacementWithArrowElement(tooltip,arrowElement,{x:x,y:y,placement:placement,middlewareData:middlewareData})})},tooltip.update(),WorkspaceManager.on(WorkspaceManager.EVENT_WORKSPACE_UPDATE_LAYOUT,tooltip.update)}function _createDomElementWithArrowElement(domTemplate,elementID,options){notificationWidgetCount++;const onElement=document.getElementById(elementID);let arrowElement,widgetID,arrowID=`notification-ui-arrow-${notificationWidgetCount}`,textTemplate=null;("string"==typeof domTemplate||domTemplate instanceof String)&&(textTemplate=domTemplate);let floatingDom=$(`<div id="${`notification-ui-widget-${notificationWidgetCount}`}" class="notification-ui-tooltip" role="tooltip">\n                                ${textTemplate||""}</div>`);return!textTemplate&&domTemplate&&floatingDom.append($(domTemplate)),onElement&&(arrowElement=$(`<div id="${arrowID}" class="notification-ui-arrow"></div>`),floatingDom.append(arrowElement)),$("body").append(floatingDom),_updatePositions(floatingDom[0],onElement,arrowElement[0],options),floatingDom}function createToastFromTemplate(title,template,options={}){options.dismissOnClick=void 0===options.dismissOnClick||options.dismissOnClick;const widgetID=`notification-toast-${++notificationWidgetCount}`,$NotificationPopup=$(Mustache.render(ToastPopupHtml,{id:widgetID,title:title}));$NotificationPopup.find(".notification-dialog-content").append($(template)),Dialogs.addLinkTooltips($NotificationPopup);let notification=new Notification($NotificationPopup,NOTIFICATION_TYPE_TOAST);return $NotificationPopup.appendTo("#toast-notification-container").hide().find(".notification-popup-close-button").click(function(){notification.close(CLOSE_REASON.CLOSE_BTN_CLICK),MainViewManager.focusActivePane()}),$NotificationPopup.show(),setTimeout(function(){$NotificationPopup.addClass("animateOpen")},0),options.autoCloseTimeS&&setTimeout(()=>{notification.close(CLOSE_REASON.TIMEOUT)},1e3*options.autoCloseTimeS),options.dismissOnClick&&$NotificationPopup.click(()=>{notification.close(CLOSE_REASON.CLICK_DISMISS)}),notification}exports.createFromTemplate=createFromTemplate,exports.createToastFromTemplate=createToastFromTemplate,exports.CLOSE_REASON=CLOSE_REASON});
//# sourceMappingURL=NotificationUI.js.map
