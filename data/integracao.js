/**
 * Classe utilitária para auxiliar a integração.
 * @author Tiago G. Ribeiro
 * @since 14/02/2016
 */
var unittestAddonUtil = {
    httpRequest : null,
    prefs       : null,

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
     * Carrega as definições de preferencia.
     * @returns {unittest_addo_util}
     */
    loadPrefs : function(){
        /*this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch("unittest-addon.");*/
        return require('sdk/simple-prefs').prefs['unittest-addon'];
        
    },
    
    /**
     * Obtém uma chave de preferência.
     * @param {type} keyPref
     * @returns {unittest_addo_util@pro;prefs@call;getCharPref}
     */
    getPref : function( keyPref ){
        if ( keyPref === null) throw ("Chave para preferência deve ser enviada.");
        if (this.prefs !== null )
            return this.prefs[ keyPref ];
        else
            throw ("Preferencias não carregada.");
    }
};


/**
 * Classe de integração com os resultado e monitoramento de resultados.
 * @author Tiago G. Ribeiro
 * @since 14/02/2016
 */
var unittestAddon = {             
    
    // 1 - Nivel modulos    
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
                    nivel++;
                    this._recursiveResultado( url , null, nivel );
                } else if ( nivel === 3 ){
                    module = elemTpAction.innerHTML;
                    var url = linkDetail[indice].href;
                    nivel++;
                    this._recursiveResultado( url , null, nivel );
                } else {
                    var elemTpNum    = document.body.querySelectorAll('tr#tpNum')[indice];
                    if (elemTpNum.innerHTML === "success"){
                        unittestAddonUtil._sucessTest++;
                    } else if (elemTpNum.innerHTML === "failed"){
                        unittestAddonUtil._errosTest++;
                    }
                }
            }    
        };
        
        unittestAddonUtil.load( url , filter  , parseResult );
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
            window.setTimeout(function(){                
                var result = this._recursiveResultado( this.config.testHost, this._getFilter(), 0 );
                panel.load( result );
            },this.config.timeCheckTest );
        } catch(e) {
            console.warn("Falha monitoramento do addon-unittest - "+e.stack());
        }
    },
    
    // Inicializa o addon.
    startup : function(){
       
        // Carregando as preferencias(configurações)
        var preference = unittestAddonUtil.loadPrefs();
        unittestAddon.config.testNamespace = preference.getPref("namespace");
        unittestAddon.config.testModule    = preference.getPref("module");
        unittestAddon.config.testHost      = preference.getPref("host");
        unittestAddon.config.timeCheckTest = preference.getPref("timeCheck");
       
        // Iniciando o monitoramento dos testes
        if (unittestAddon.config.testHost!=="" && unittestAddon.config.testNamespace!=="")
            unittestAddon._monitor();
        
        
        /*var test = '{"list":['+
                           '{"module":"estoque", "test":"10", "error":"2"}, '+
                           '{"module":"financeiro", "test":"5", "error":"0"}, '+
                           '{"module":"comercial", "test":"0", "error":"0"}]}';*/
                
    }

};

window.addEventListener("load", function(e) { unittestAddon.startup(); }, false);