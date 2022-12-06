if(!self.Config){const url=new URL(location);function getNormalizeRoute(){let route=url.searchParams.get("route")||"fs";return route=(route=route.replace(/^\/*/,"")).replace(/\/*$/,"")}self.Config={route:getNormalizeRoute(),disableIndexes:null!==url.searchParams.get("disableIndexes"),debug:!1}}
//# sourceMappingURL=config.js.map
