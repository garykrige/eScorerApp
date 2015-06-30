/* MainModel
*
* Copyright - Gary Krige
*/
var frame = require("ui/frame");        
var http = require("http");
var appSettings = require("application-settings");

var observable = require("data/observable");
function MainModel() {
    observable.Observable.call(this);
};

MainModel.prototype = Object.create(observable.Observable);
MainModel.prototype.constructor = MainModel();

MainModel.prototype.newMatch = function() {
    // Create a new match on the server
    http.request({
        url     : global.URL + "/newmatch",
        method  : "POST",
        headers : { "Content-Type": "application/json" },
        content : JSON.stringify({})
    }).then(function (response) {
        // Successful
        appSettings.setNumber("MatchID", response.content.toJSON().id);
        global.MATCH_ID = response.content.toJSON().id;

        console.log(global.MATCH_ID + "");
        frame.topmost().navigate({
            moduleName: "./views/scorer"
        });
        
    }, function (e) {
        // TODO: Deal with errors properly
        console.log("Error occurred " + e);
    });
};
//exports.MainModel = MainModel;
exports.vm = new MainModel();
