var fs=require("fs"),path=require("path"),fpath=path.resolve(__dirname,"node_modules","acorn","dist","acorn_loose.js"),content=fs.readFileSync(fpath,"utf8");content=content.replace(/'\.\/acorn\.js'/g,"'./acorn'"),fs.writeFileSync(fpath,content,"utf8");
//# sourceMappingURL=fix-acorn.js.map
