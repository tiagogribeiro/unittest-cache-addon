"use strict";
var self = require("sdk/self");
var resultTest = require("./lib/result.js");

// Preferences
var preference = {
      urlTest: "http://10.1.1.3:57772/csp/sys/%25UnitTest.Portal.Home.zen"
}

var panel = require("sdk/panel").Panel({
	 contentURL: self.data.url("unittest-panel.html"),
    onHide: handleHide,    
    height: 305
});

panel.port.on("login-submit", function (text) {
	panel.contentURL = self.data.url("unittest-panel.html");
	hiddenFrame.element.contentWindow.location = preference.urlTest;
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
    onChange: handleChange
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: buttonIcon
        });        
    }
}

function handleHide() {
    buttonIcon.state('window', {checked: false});
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
            	resultTest.monteResultado(frame.element.contentDocument.body);
            }
            
        }, true, true);       
    }
}));
