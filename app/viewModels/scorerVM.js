/* Scorer ViewModel
 *
 * Copyright - Gary Krige
 */
var http = require("http");
var Observable = require("data/observable");
var model = new Observable.Observable();
var dialogs = require("ui/dialogs");

// Internal Data
var bat1    = { name : "Adrian", runs : 0, balls : 0, strike : "*"};
var bat2    = { name : "Gary", runs : 0, balls : 0, strike : " "};
var innings = { runs : 0, wickets : 0, overs : 0, balls : 0};

var ballTypes = ["Normal", "Wide", "No-ball", "Wicket"]

// Data Bindings
model.inningsScore = ""
model.batsman1 = ""; // Batsman 1
model.batsman2 = ""; // Batsman 2
model.ballType = "Normal";
model.batTeam = "WBHS 1st XI";
model.overs = "";

/* updateGUI()
*
* Update all data bindings to update the frontend.
*/
var updateGUI = function() {
    model.set("inningsScore", innings.runs + " / " + innings.wickets);
    model.set("batsman1", bat1.name + " - " + bat1.runs + " (" + bat1.balls + ")" + bat1.strike);
    model.set("batsman2", bat2.name + " - " + bat2.runs + " (" + bat2.balls + ")" + bat2.strike);
    model.set("overs", innings.overs + "." + innings.balls);
};
updateGUI();

/* sendToServer()
* 
* Send an event to the backend server.
*/
var sendToServer = function(data, cb){
    http.request({
        url: global.URL + "/event",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(data)
    }).then(function (response) {
        cb(response);
        console.log(response.content.toJSON());
    }, function (e) {
        console.log("Error occurred " + e);
    });

};
/*
* A generic game event
*
*/
model.gameEvent = function(n){

    switch(model.get("ballType")){
    case ballTypes[0]:
        runsEvent(n);
        break;
    case ballTypes[1]:
        wideEvent(n);
        break;
    case ballTypes[2]:
        noBallEvent(n);
        break;
    case ballTypes[3]:
        wicketEvent(n);
        break;
    } 
    model.set("ballType", ballTypes[0]);
};

/* 
* -- runsEvent
* 
* This function registers a normal runs event.
*
* @param runs : number of runs scored.
*/
var runsEvent = function(runs) {
    // Innings Update
    innings.runs += runs;
    innings.balls++;

    if (innings.balls>5){
        dialogs.confirm({
            title: "End Over?",
            message: innings.balls + " balls have been bowled.",
            cancelButtonText: "No",
            okButtonText: "OK"
        }).then(function (result) {
            if (result){
                innings.overs++;
                innings.balls=0;
            } 
            updateGUI();
        });
    }

    var batterName = "";
    // Batsman Update
    if ( bat1.strike === "*" ) {
        bat1.runs += runs;
        bat1.balls++;
        batterName = bat1.name;
    } else {
        bat2.runs += runs;
        bat2.balls++;
        batterName = bat2.name;
    }

    // Swap Strike?
    if (runs%2 == 1) {
        var temp = bat1.strike;
        bat1.strike = bat2.strike;
        bat2.strike = temp;
    }
    
    sendToServer({ name: batterName, ballType: "normal", runs: runs });
    updateGUI();
};

/* 
* -- wideEvent
* 
* This function registers a wide event.
*
* @param runs : number of runs scored.
*/
var wideEvent = function(runs) {
    // Innings Update
    innings.runs += runs+1;
    
    sendToServer({ name: "", ballType: "wide", runs: runs+1 });
    updateGUI();
};
/* 
* -- noBallEvent
* 
* This function registers a no ball event.
*
* @param runs : number of runs scored.
*/
var noBallEvent = function(runs) {
    // Innings Update
    innings.runs += runs+1;
    
    // Batsman Update
    var batterName = "";
    if ( bat1.strike === "*" ) {
        bat1.runs += runs;
        bat1.balls++;
        batterName = bat1.name;
    } else {
        bat2.runs += runs;
        bat2.balls++;
        batterName = bat2.name;
    }

    // Swap Strike?
    if (runs%2 == 1) {
        var temp = bat1.strike;
        bat1.strike = bat2.strike;
        bat2.strike = temp;
    }
    
    sendToServer({ name: batterName, ballType: "no-ball", runs: runs+1 });
    updateGUI();
};

/*
* -- WicketEvent
*
* This function registers a wicket event.
*
* @param type   : type of wicket event
* @param whoOut : which batter is out
*
*/
var wicketEvent = function(runs){
    // How out?
    // TODO
    
    // Who is out?
    // TODO
    var batterName = "";
    
    // Pick new Batter
    // TODO
    
    // Update bat? object
    if ( bat2.strike === "*" ) {
        bat2 = { name : "New", runs : 0, balls : 0, strike : "*"};
        batterName = bat2.name;
    } else {
        bat1 = { name : "New", runs : 0, balls : 0, strike : "*"};
        batterName = bat1.name;
    }

    sendToServer({ name: batterName, ballType: "wicket", runs: runs });
    innings.wickets++;
    updateGUI();
};

/*
* -- ChangeType
*
*
*/
model.changeType = function() {
    switch(model.get("ballType")){
    case ballTypes[0]:
        model.set("ballType", ballTypes[1]);
        break;
    case ballTypes[1]:
        model.set("ballType", ballTypes[2]);
        break;
    case ballTypes[2]:
        model.set("ballType", ballTypes[3]);
        break;
    case ballTypes[3]:
        model.set("ballType", ballTypes[0]);
        break;
    } 
};    
module.exports = model;
