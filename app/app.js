var application = require("application");
var platform = require("platform");

global.URL = "http://localhost:1337";

application.cssFile = "./app.css";
application.onLaunch = function (context) {
    
    var appSettings = require("application-settings"); //This needs to have a context for android

    // Is there an active match?
    global.MATCH_ID = appSettings.getNumber("MatchID", -1);

    //HACKING!
    global.MATCH_ID = -1;
    
    if (global.MATCH_ID !== -1){
        application.mainModule = "./views/scorer";
    } else {
        application.mainModule = "./views/main";
    }
    // For Android applications, the context is an android.content.Intent class.
    // For iOS applications, the context is undefined.
    if (application.android) {
        console.log("Launched Android application with the following intent: " + context + ".");
        // hook the onActivityCreated callback upon application launching
        //application.android.onActivityCreated = function (activity) {
        //    // apply the default theme once the Activity is created
        //    var id = activity.getResources().getIdentifier("AppTheme", "style", activity.getPackageName());
        //    activity.setTheme(id);
        //};
    }
    else if (application.ios) {
        console.log("Launched iOS application.");
    }
    //no global action bar hiding for now
    //the frame.topmost is not yet initialised
    // var iosFrame = frame.topmost().ios;
    // if (iosFrame) {
    //     // Fix status bar color and nav bar vidibility
    //     iosFrame.controller.view.window.backgroundColor = UIColor.blackColor();
    //     iosFrame.navBarVisibility = "never";
    // }
    // var androidFrame = frame.topmost().android;
    // if (androidFrame) {
    //     androidFrame.actionBar.hide();
    //}
    console.log("Device model: " + platform.device.model);
    console.log("Device type: " + platform.device.deviceType);
    console.log("OS: " + platform.device.os);
    console.log("OS version: " + platform.device.osVersion);
    console.log("SDK Version: " + platform.device.sdkVersion);
    console.log("Screen width: " + platform.screen.mainScreen.widthPixels);
    console.log("Screen height: " + platform.screen.mainScreen.heightPixels);
    console.log("Screen scale: " + platform.screen.mainScreen.scale);
};
application.onSuspend = function () {
    console.log("Application suspended.");
};
application.onResume = function () {
    console.log("Application resumed.");
};
application.onExit = function () {
    console.log("Application will exit.");
};
application.onLowMemory = function () {
    console.log("Memory is low.");
};
application.onUncaughtError = function (error) {
    console.log("Application error: " + error.name + "; " + error.message + "; " + error.nativeError);
};

application.start();
