var dataRoute = require("./task/data.json");
var namesRoute = require("./task/names.json");
var currenciesRoute = require("./task/currencies.json");

module.exports = function () {
  return {
    dataRoute,
    namesRoute,
    currenciesRoute,
  };
};
