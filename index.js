"use strict";
var self = require("sdk/self");
var resultTest = require("./lib/result.js");
var tabs = require("sdk/tabs");

// Preferences
var preference = {
      urlTest: "http://10.1.1.150:57772/csp/sys/%25UnitTest.Portal.Home.zen"
}

var panel = require("sdk/panel").Panel({
	 contentURL: self.data.url("unittest-panel.html"),
    onHide: panelHide,
    onShow: panelShow,    
    height: 250
});

panel.port.on("login-submit", function (text) {
    panel.contentURL = self.data.url("unittest-panel.html");
    hiddenFrame.element.contentWindow.location = preference.urlTest;
});

panel.port.on("load-suite", function (link) {
	tabs.open(link);
});

var { ToggleButton } = require("sdk/ui/button/toggle");
var buttonIcon = ToggleButton({
    id: "unittest-button-icon",
    label: "UnitTest",
    icon: {
        "16": "./icon_16.png",
        "32": "./icon_32.png",
        "64": "./icon_64.png"
    },
    onChange: buttonChange
});

function buttonChange(state) {
    if (state.checked) {
        panel.show({
            position: buttonIcon
        });        
    }
}

function panelHide() {
    buttonIcon.state('window', {checked: false});
}

function panelShow() {
    panel.port.emit("preferences", preference.urlTest);	
}

// Iframe Hidden.
var hiddenFrames = require("sdk/frame/hidden-frame");
var hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
    onReady: function () {
        this.element.contentWindow.location = preference.urlTest;
        var frame = this;
        this.element.addEventListener("DOMContentLoaded", function () {        	   
        	   
	    var requiresLogin = (frame.element.contentDocument.title.indexOf("Login") > -1);
            if (requiresLogin) {
                panel.contentURL = self.data.url("unittest-login.html");
            } else {
            	var tests = resultTest.testsPerformed(frame.element.contentDocument.body);
            	panel.port.emit("testsPerformed", tests);            	
            }
            
        }, true, true);       
    }
}));
