/* Main View
 *
 * Copyright - Gary Krige
 */
var frame       = require("ui/frame");
var http        = require("http");
var appSettings = require("application-settings");
var viewModel   = new observable.Observable();
//var dialogs     = require("ui/dialogs");

// Inital page setup and data bindings
exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = viewModel;
};

exports.newMatch = function() { 
    http.request({
        url     : global.URL + "/match",
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        content : JSON.stringify({})
    }).then(function (response) {
        appSettings.setNumber("MatchID", response.content.toJSON().id);
        global.MATCH_ID = response.content.toJSON().id;
        console.log(global.MATCH_ID);
        frame.topmost().navigate({
            moduleName: "./views/scorer"
        });
    }, function (e) {
        console.log("Error occurred " + e);
    });
};
