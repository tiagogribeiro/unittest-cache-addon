"use strict";
/**
 * Classe utilitária para auxiliar a integração.
 * @author Tiago G. Ribeiro
 * @since 14/02/2016
 */
var UnittestAddonUtil = {
    httpRequest : null,
    prefsSDK    : require('sdk/simple-prefs'),

    /**
     * Obtém um instância do XMLHTTPRequest browser.
     * @returns {XMLHttpRequest}
     */
    _getInstance : function(){
        if ( this.httpRequest === null ) 
            this.httpRequest = new XMLHttpRequest();
        return this.httpRequest; 

    },

    /**
     * Obtém dados de uma determinada URL e retorna pelo callback 
     * assim que estiver todo carregado.
     * @param {String} url
     * @param {String} args
     * @param {Function} callback
     */
    load : function( url, args, callback ){
        var httprequest = this._getInstance();
        httprequest.open("GET", url, true);
        httprequest.onreadystatechange = function(){
            if ( httprequest.readyState === XMLHttpRequest.DONE) {                   
                callback( httprequest.responseText );
            }
        };
        httprequest.send(args || null);
    },        
    
    /**
     * Obtém uma chave de preferência.
     * @param {type} keyPref
     * @returns {unittest_addo_util@pro;prefs@call;getCharPref}
     */
    getPref : function( keyPref ){
        if ( keyPref === null) throw ("Chave para preferência deve ser enviada.");
        if (this.prefs !== null )
            return this.prefsSDK['unittest-addon'].prefs[ keyPref ];
        else
            throw ("Preferencias não carregada.");
    }
};


/**
 * Classe de integração com os resultado e monitoramento de resultados.
 * @author Tiago G. Ribeiro
 * @since 14/02/2016
 */
var UnittestAddon = {             
    
    matrizResults : [],    
    
    // Configurações para funcionamento do addon.
    config : {
         timeCheckTest : 500,
         testNamespace: '',
         testHost : '',
         testModule : ''
    },   
   
    
    /**
     * Execute o recursive sobre os resultados obtidos.
     * @param {String} url
     * @param {String} filter
     * @param {int} nivel     
     */
    _recursiveResultado : function( url, filter, nivel ){
        
        /**
         * Estrutura de resultados de teste.
         * Nive - Local
         * 1 - Código do resultado.        
         * 2 - Nome suíte de teste. (ignorado)
         * 3 - Case testes. (filter os modulos)
         * 4 - Unit testes. (filter os resultados)
         * 5 - Detalhe de cada unit test.
         */
        var parseResult = function(){            
            var elemTpAction = document.body.querySelectorAll('tr#tpAction');       
            var linkDetail   = elemTpAction.querySelectorAll('a');
            var module       = null;

            for( var indice in elemTpAction ){   
                // Somente até o resultado dos test unitário, caso queria os detalhes dos testes,
                // será necessário entrar mais um nível - Tiago G. Ribeiro
                if (nivel < 4){                   
                    var url = linkDetail[indice].href;                   
                    this._recursiveResultado( url , null, nivel );
                } else if ( nivel === 3 ){
                    module = linkDetail[indice].innerHTML;
                    var url = linkDetail[indice].href;                    
                    this._recursiveResultado( url , null, nivel );
                } else {
                    var elemTpNum    = document.body.querySelectorAll('tr#tpNum')[indice];
                    if (elemTpNum.innerHTML === "success"){
                        UnittestAddonUtil._sucessTest++;
                    } else if (elemTpNum.innerHTML === "failed"){
                        UnittestAddonUtil._errosTest++;
                    }
                }
                nivel++;
            }    
        };
        
        UnittestAddonUtil.load( url , filter  , parseResult );
        return this; 
    },

    /**
     * Monta os filtro utilizado na busca dos resultados dos testes.
     * @returns {String}
     */
    _getFilter : function(){
         var filter = "?"
                   + "$NAMESPACE=" + this.config.testNamespace;
         return filter;
    },

    /**
     * Pooling de monitoramento dos resultados dos testes.        
     */
    _monitor : function(){ 
        try  {             
            UnittestAddon.config.testNamespace = UnittestAddonUtil.prefs.getPref("namespace");
            UnittestAddon.config.testModule    = UnittestAddonUtil.prefs.getPref("module");
            UnittestAddon.config.testHost      = UnittestAddonUtil.prefs.getPref("host");
            UnittestAddon.config.timeCheckTest = UnittestAddonUtil.prefs.getPref("timeCheck");
            window.setTimeout(function(){                
                var result = UnittestAddon._recursiveResultado( UnittestAddon.config.testHost, 
                                                                UnittestAddon._getFilter(), 0 );
                
                
                
                 /*var test = '{"list":['+
                           '{"module":"estoque", "test":"10", "error":"2"}, '+
                           '{"module":"financeiro", "test":"5", "error":"0"}, '+
                           '{"module":"comercial", "test":"0", "error":"0"}]}';*/
       
                panel.load( result );
            },this.config.timeCheckTest );
        } catch(e) {
            console.warn("Falha monitoramento do addon-unittest - "+e.stack());
        }
    }

};

window.addEventListener("load", function(e) { unittestAddon._monitor(); }, false);