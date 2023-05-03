if(!self.Config){function getNormalizeRoute(){let route=new URL(location).searchParams.get("route")||"fs";return route=(route=route.replace(/^\/*/,"")).replace(/\/*$/,"")}self.Config={route:getNormalizeRoute(),disableIndexes:null!==new URL(location).searchParams.get("disableIndexes"),debug:!1}}
//# sourceMappingURL=config.js.map
