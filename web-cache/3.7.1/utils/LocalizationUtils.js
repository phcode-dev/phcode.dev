define(function(require,exports,module){var Strings=require("strings");function getLocalizedLabel(locale){var key="LOCALE_"+locale.toUpperCase().replace("-","_"),i18n=Strings[key];return void 0===i18n?locale:i18n}exports.getLocalizedLabel=getLocalizedLabel});
//# sourceMappingURL=LocalizationUtils.js.map
