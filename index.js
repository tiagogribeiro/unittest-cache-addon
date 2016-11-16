"use strict";
var self = require("sdk/self");
var resultTest = require("./lib/result.js");
var tabs = require("sdk/tabs");
var { setTimeout } = require("sdk/timers");
var http = require("sdk/net/url");

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

/**
 * Monta a url para consulta de resultados no servidor de testes.
 * @returns {String}
 */
function getUrlServer(){

    var prefs = require("sdk/simple-prefs").prefs;
    var protocol = prefs["serverProtocol"];
    var port = prefs["serverPort"];
    var url = prefs["serverUrl"];
    var namespace = prefs["namespace"];

    var port = (port!=="")  ? ":"+port: "";
    var url = protocol + url + port;
    var http = url+ '/csp/' + namespace + '/%25UnitTest.Portal.Home.zen';

    return http;
}

function panelShow(){
   var prefs = require("sdk/simple-prefs").prefs;
   var namespace = prefs["namespace"];
   var urlServidor = prefs["serverUrl"];

   if ((namespace!==undefined)&&(urlServidor!==undefined)){
       //hiddenFrame.element.contentWindow.location = getUrlServer();
       loadResult( getUrlServer() );
       panel.port.emit('configure',false);
   } else {
       panel.port.emit('configure',true);
   }
}

function isLoadedPage() {
    return (panel.contentURL == self.data.url("unittest-panel.html"))
}

/**
 * Iframe oculto.
 * @type Module hidden-frame|Module hidden-frame
 */
/*var hiddenFrames = require("sdk/frame/hidden-frame");
var hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
    onReady: function () {
        var frame = this;
        this.element.addEventListener("DOMContentLoaded", function () {

            var isLoged = (frame.element.contentDocument.title.indexOf("UnitTest") > -1);
            if (isLoged) {
                if (!isLoadedPage()) {
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
}));*/

function loadResult( url ){
    var _this = this;
    http.readURI( url ).then(function(htmlString) {

        var parser = new DOMParser();
        var html = parser.parseFromString(htmlString, "text/html");

        var position = html.indexOf('tpAction');
        console.log(position)
        console.log( html.substring(position,70000)  );

      //var results = resultTest.testsPerformed( value );
      //panel.port.emit("render-results", results);

  }, function(reason) {
        console.log(reason);
    });
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
 * Notificação que o login foi submetido.
 */
panel.port.on("login-submit", function (text) {
    console.log('Submetendo....');
    loadResult( getUrlServer() );
    //hiddenFrame.element.contentWindow.location = getUrlServer();
});

/**
 * Registrando as configurações do usuário.
 * @author Tiago G. Ribeiro
 */
panel.port.on("save-preference", function(data){

    var prefs = require("sdk/simple-prefs").prefs;
        prefs["serverProtocol"] = data.protocol;
        prefs["serverUrl"] = data.url;
        prefs["serverPort"] = data.port;
        prefs["namespace"] = data.namespace;

    panel.port.emit("configure",false);
});

/**
 * Obtendo as configurações do usuário.
 * @author Tiago G. Ribeiro
 */
panel.port.on("get-preference", function() {
    var prefs = require("sdk/simple-prefs").prefs;
    var preference = {
        'protocol' : prefs["serverProtocol"],
        'port': prefs["serverPort"],
        'url' : prefs["serverUrl"],
        'namespace' : prefs["namespace"]
    };
    console.log(preference.url);
    return preference;
});
