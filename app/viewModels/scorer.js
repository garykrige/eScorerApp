/* Scorer ViewModel
 *
 * Copyright - Gary Krige
 */
var observable = require("data/observable");
var http = require("http");
var dialogs = require("ui/dialogs");

// Local Data structures
function Batsman(name) {
    this.name = name;
    this.balls = 0;
    this.runs = 0;
    this.strike = false;
};
Batsman.prototype.toString = function(){
    return this.name + " " + this.runs + " (" + this.balls + ")";
};

function Bowler(name) {
    this.name = name;
    this.balls = 0;
    this.overs = 0;
    this.wickets = 0;
    this.runs = 0;
};
Bowler.prototype.toString = function(){
    return this.name + " " + this.wickets + "/" + this.runs;
};

// ViewModel Object
function ScorerModel() {
    observable.Observable.call(this);

    // Internals
    this.strikeBatter = null;
    this.batter1 = Batsman("Adrian");
    this.batter2 = Batsman("Gary");

    // Binded to view
    this.set("batter1", "");
    this.set("batter2", "");
    this.set("bowler", "");
    this.set("inningsScore", "");
    this.set("ballType", "");
    
    this.innings = {runs : 0, wickets : 0, overs : 0, balls : 0};
    this.ballTypes = ["Normal", "Wide", "No-ball", "Wicket"];
    this.typeSelection = 0;

    this.updateGUI();
};

ScorerModel.prototype.updateGUI(model) {
    this.set("batter1", batter1.toString());
    this.set("batter2", batter2.toString());
    this.set("bowler", bowler.toString());
    this.set("inningsScore", );
    this.set("ballType", ballTypes[typeSelection]);
};

ScorerModel.prototype = observable.Observable.prototype;
ScorerModel.prototype.constructor = ScorerModel;

ScorerModel.prototype.btnTap0 = function() { gameEvent(0); };
ScorerModel.prototype.btnTap1 = function() { gameEvent(1); };
ScorerModel.prototype.btnTap2 = function() { gameEvent(2); };
ScorerModel.prototype.btnTap3 = function() { gameEvent(3); };
ScorerModel.prototype.btnTap4 = function() { gameEvent(4); };
ScorerModel.prototype.btnTap5 = function() { gameEvent(5); };
ScorerModel.prototype.btnTap6 = function() { gameEvent(6); };    

ScorerModel.prototype.btnChgType = function() {
    console.log("NOT IMPLEMENTED");
};    

ScorerModel.prototype.sendToServer = function(data, cb){
    data.matchID = global.MATCH_ID;
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

ScorerModel.prototype.runsEvent = function(runs) {    
    // Batsman Update

    // Swap Strike?
    if (runs%2 == 1) {
        var temp = batter1.strike;
        batter1.strike = batter2.strike;
        batter2.strike = temp;
    }

    // Innings Update
    innings.runs += runs;
    innings.balls++;
};

ScorerModel.prototype.wideEvent = function(runs) {
    // Innings Update
    innings.runs += runs+1;
    
    sendToServer({
        batsman  : ,
        bowler   : bowler.name,          // TODO
        ballType : "wide",
        runs     : runs+1
    });
};

ScorerModel.prototype.noBallEvent = function(runs) {
    // Innings Update
    innings.runs += runs+1;
    
    // Batsman Update
    var batterName = "";
    if ( batter1.strike === "*" ) {
        batter1.runs += runs;
        batter1.balls++;
        batterName = batter1.name;
    } else {
        batter2.runs += runs;
        batter2.balls++;
        batterName = batter2.name;
    }

    // Swap Strike?
    if (runs%2 == 1) {
        var temp = batter1.strike;
        batter1.strike = batter2.strike;
        batter2.strike = temp;
    }
    
    sendToServer({
        batsman  : batterName,
        bowler   : "",          // TODO
        ballType : "noBall",
        runs     : runs+1
    });
};

ScorerModel.prototype.wicketEvent = function(model, runs){
    // How out?
    // TODO
    
    // Who is out?
    // TODO
    var batterName = "";
    
    // Pick new Batter
    // TODO
    
    // Update bat? object
    if ( batter2.strike === "*" ) {
        batter2 = { name : "New", runs : 0, balls : 0, strike : "*"};
        batterName = batter2.name;
    } else {
        batter1 = { name : "New", runs : 0, balls : 0, strike : "*"};
        batterName = batter1.name;
    }

    sendToServer({ name: batterName, ballType: "wicket", runs: runs });
    innings.wickets++;
};

ScorerModel.prototype.gameEvent = function(n){
    if ( batter1.strike === "*" ) {
        this.strikeBatter = batter1;
    } else {
        this.strikeBatter = batter2;
    }

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
    
    // End over?
    if (innings.balls>5){
        dialogs.confirm({
            title: "End Over?",
            message: innings.balls + " balls have been bowled.",
            cancelButtonText: "No",
            okButtonText: "OK"
        }).then(function (result) {
            var endOver;
            if (result){
                endOver = "1";
                innings.overs++;
                innings.balls = 0;   
            }

            // Ready to end over
            sendToServer({
                batsman  : batterName,
                bowler   : "",          // TODO
                ballType : "normal",
                runs     : runs,
                endOver  : endOver
            });
        });
    } else { // Need to deal with async
        // 
        sendToServer({
            batsman  : batterName,
            bowler   : bowler,          // TODO
            ballType : ballTypes[typeSelection],
            runs     : runs
        });
    }
};


exports.vm = new ScorerModel();
