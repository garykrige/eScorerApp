/* Match Details View
 *
 * Copyright - Gary Krige
 */

var model = require("../viewModels/matchDetails");

// Inital page setup and data bindings
exports.navigatedTo = function(args) {
    var page = args.object;
    page.bindingContext = model;
};
