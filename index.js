var self  = require("sdk/self");
var { ToggleButton } = require("sdk/ui/button/toggle");
var panel = require("sdk/panel").Panel({
	contentURL: self.data.url("unittest-panel.html"),
	onHide: handleHide,
	height: 305
	//contentScriptFile: data.url("get-text.js")
});

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
