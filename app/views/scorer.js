/* Scorer
 *
 * Copyright - Gary Krige
 */
var model = require("../viewModels/scorer");

function onNavigatedTo(args) {
    console.log("Scorer");
    var page = args.object;
    page.bindingContext = model.vm;
};

exports.onNavigatedTo = onNavigatedTo;

