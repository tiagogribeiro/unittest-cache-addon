"use strict";
var self = require("sdk/self");
var resultTest = require("./lib/result.js");
var tabs = require("sdk/tabs");
var { setTimeout } = require("sdk/timers");
var pageResultLoaded = false;

/**
 * Carregando do painel principal do Addon.
 * @type type
 */
var panel = require("sdk/panel").Panel({
    contentURL: self.data.url("unittest-default.html"),
    onHide: function() {
        buttonIcon.state('window', {checked: false});
    },
    onShow: panelShow,
    height: 370,
    width: 430
});

function panelShow(){
   var prefs = require("sdk/simple-prefs").prefs;

   var namespace = prefs["namespace"];
   var urlServidor = prefs["urlTest"];

   if ((namespace!==undefined)&&(urlServidor!==undefined)){
       hiddenFrame.element.contentWindow.location = getUrlServer();
       panel.port.emit('urlSubmit',getUrlServer());
       panel.port.emit('configure',false);
   } else {
       panel.port.emit('configure',true);
   }
}

/**
 * Iframe oculto.
 * @type Module hidden-frame|Module hidden-frame
 */
var hiddenFrames = require("sdk/frame/hidden-frame");
var hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
    onReady: function () {
        var frame = this;
        this.element.addEventListener("DOMContentLoaded", function () {

            var isLoged = (frame.element.contentDocument.title.indexOf("UnitTest") > -1);
            if (isLoged) {
                if (resultPageLoaded() == false) {
            	     panel.contentURL = self.data.url("unittest-panel.html");
                }

                var results = resultTest.testsPerformed( frame.element.contentDocument.body );
                setTimeout(function(){
                    panel.port.emit("render-results", results);
                },500);

            } else {
                panel.contentURL = self.data.url("unittest-default.html");
                panel.port.emit("login-failure");
            }

        }, true, true);
    }
}));

function resultPageLoaded() {
    return (panel.contentURL == self.data.url("unittest-panel.html"))
}

var { ToggleButton } = require("sdk/ui/button/toggle");
var buttonIcon = ToggleButton({
    id: "unittest-button-icon",
    label: "UnitTest",
    icon: {
        "16": "./icon_16.png",
        "32": "./icon_32.png",
        "64": "./icon_64.png"
    },
    onChange: function(state) {
    if (state.checked) {
        panel.show({
            position: buttonIcon
        });
    }
}
});

panel.port.on("load-suite", function (link) {
    tabs.open(link);
});

/**
 * Monta a url para consulta de resultados no servidor de testes.
 * @returns {String}
 */
function getUrlServer(){
    var prefs = require("sdk/simple-prefs").prefs;
    var url = prefs["urlTest"];
    var namespace = prefs["namespace"];

    var http = url+ '/csp/' + namespace + '/%25UnitTest.Portal.Home.zen';
    return http;
}

/**
 * Notificação que o login foi submetido.
 */
panel.port.on("login-submit", function (text) {
    console.log('Submetendo....');
    hiddenFrame.element.contentWindow.location = getUrlServer();
});

/**
 * Registrando as configurações do usuário.
 * @author Tiago G. Ribeiro
 */
panel.port.on("save-preference", function (data) {

    var port = (data.port!=="")  ? ":"+data.port : "";

    var prefs = require("sdk/simple-prefs").prefs;
    prefs["urlTest"] =  data.protocol + data.url + port;
    prefs["namespace"]=   data.namespace;this
    panel.port.emit("configure",false);
    panel.port.emit('urlSubmit',getUrlServer());
});

/**
 * Obtendo as configurações do usuário.
 * @author Tiago G. Ribeiro
 */
panel.port.on("get-preference", function (data) {
    var prefs = require("sdk/simple-prefs").prefs;
    var result = { url : prefs.urlTest, namespace : prefs.namespace};
    return result;
});
