"use strict";
var self = require("sdk/self");

var { ToggleButton } = require("sdk/ui/button/toggle");
  var panel = require("sdk/panel").Panel({
    contentURL: self.data.url("unittest-panel.html"),
    onHide: handleHide,
    height: 305
  //scontentScriptFile: self.data.url("api.js")
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

//------------------------------------------
// Implementando a lógica dos resultados.
var NIVEL_ULTIMO = 4;
var NIVEL_RESULTADO = 3;
var _countResultados = 0;
var _results = [];
var _linhaDeResultado = null;

// Definição das configurações.
var preference = {
    urlTest: "resource://unittest-cache-addon/html/Pagina1.html"
}


// Iframe Hidden.
var hiddenFrames = require("sdk/frame/hidden-frame");
var hiddenFrame = hiddenFrames.add(hiddenFrames.HiddenFrame({
    onReady: function () {
        this.element.contentWindow.location = preference.urlTest;
        var self = this;
        this.element.addEventListener("DOMContentLoaded", function () {
            //console.log(self.element.contentDocument.body);
            _monteResultado(self.element.contentDocument.body);
        }, true, true);
    }
}));

function _isUltimoNivelResultado(){
  return (_countResultados === NIVEL_ULTIMO);
}

function _isNivelResultadoTest(){
  return (_countResultados === NIVEL_RESULTADO);
}

function _resultadoDeSucess(){
  return (/^success$/g.test(_linhaDeResultado.innerHTML()) ? true : false);
}

function _resultadoDeFalha(){
  return (/^failed$/g.test(_linhaDeResultado.innerHTML()) ? true : false);
}

function _moduloDoResultado(){
  var result = _linhaDeResultado.innerHTML().split('.')[1];
  if (result==='')
      throw "Sem definição do módulo do resultado";
  return result;
}

function _proximaPaginaDeResultado(){
  _linhaDeResultado.child().click();
}

function _existeMaisResultados(){
  return (_linhaDeResultado.length > 0);
}

function _listResultados(){
  return _linhaDeResultado.getElementsById("tpNum");

}

function _incrementaContagemResultado(){
    _countResultados++;
}
function _setResultado( body ){
  _linhaDeResultado = body.getElementsById('tpAction');
}

function _monteResultado( body ) {

    _setResultado( body );

    if ( _isUltimoNivelResultado() )
        return false;

    if ( _isNivelResultadoTest() ){
        for ( var indice in _listResultados() ) {
            _linhaDeResultado = _listResultados()[indice];
            _results.push({
                modulo: _moduloDoResultado(),
                success: _resultadoDeSucess(),
                failed: _resultadoDeFalha()
            });
            _incrementaContagemResultado();            
        }
        console.log( "Resultados:" + _results );
    } else if ( _existeMaisResultados() ) {
          _incrementaContagemResultado();
          _proximaPaginaDeResultado();
          // Sem necessidade de chamar novamente para montar pois o próprio controle do frame
          //  irá disparar novamente este método.
    }
}
