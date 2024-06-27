define(function(require,exports,module){const KeyBindingManager=require("command/KeyBindingManager"),vscodeKeyMap=JSON.parse(require("text!./vscode.json")),VSCODE_PACK_ID="vscode";KeyBindingManager.registerCustomKeymapPack("vscode","Visual Studio Code",vscodeKeyMap)});
//# sourceMappingURL=vscode.js.map
