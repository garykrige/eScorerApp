/* Scorer
 *
 * 
 * 
 * Copyright - Gary Krige
 */

var viewModel = require("../viewModels/scorerVM.js");

// Inital page setup and data bindings
exports.navigatedTo = function(args) {
    var page = args.object;
    page.bindingContext = viewModel;
    console.log(JSON.stringify(page.navigationContext));
};

// Runs Events
exports.btnChgType = function() {
    viewModel.changeType();
};
exports.btnChgTypeSwipe = function(args) {
    if(args.direction == 1){
        // BACK
    } else if (args.direction == 2){
        // FORWARD
        
        modle.changeType();
    }
};
exports.btnTap1 = function() { viewModel.gameEvent(1); };
exports.btnTap2 = function() { viewModel.gameEvent(2); };
exports.btnTap3 = function() { viewModel.gameEvent(3); };
exports.btnTap4 = function() { viewModel.gameEvent(4); };
exports.btnTap5 = function() { viewModel.gameEvent(5); };
exports.btnTap6 = function() { viewModel.gameEvent(6); };
exports.btnTap0 = function() { viewModel.gameEvent(0); };

