/* Main View
 *
 * Copyright - Gary Krige
 */
var model = require('../viewModels/main');

function onNavigatedTo(args) {
    var page = args.object;
    page.bindingContext = model.vm;
};

exports.onNavigatedTo = onNavigatedTo;
