define(function(require,exports,module){const KeyBindingManager=require("command/KeyBindingManager"),vscodeKeyMap=JSON.parse(require("text!./vscode.json")),VSCODE_PACK_ID="VSCode";KeyBindingManager.registerCustomKeymapPack("VSCode","VSCode",vscodeKeyMap)});
//# sourceMappingURL=vscode.js.map
