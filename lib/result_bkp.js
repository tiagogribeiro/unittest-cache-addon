"use strict";
//------------------------------------------
// Implementando a lógica dos resultados.
var NIVEL_ULTIMO = 4;
var NIVEL_RESULTADO = 3;
var _countResultados = 0;
var _results = [];
var _linhaDeResultado = null;

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

function monteResultado( body ) {
	console.log("debug: Monta resultado");
	
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

exports.monteResultado = monteResultado;
