var utilAddon = {
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
     * @returns {utilAddon}
     */
    loadPrefs : function(){
        this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch("unittest-addon.");
        return this;
        
    },
    
    /**
     * Obtém uma chave de preferência.
     * @param {type} keyPref
     * @returns {utilAddon@pro;prefs@call;getCharPref}
     */
    getPref : function( keyPref ){
        if ( keyPref === null) throw ("Chave para preferência deve ser enviada.");
        if (this.prefs !== null )
            return this.prefs.getCharPref( keyPref );
        else
            throw ("Preferencias não carregada.");
    }
};

var AddonUnitTest = {             

    errosTest : 0,
    sucessTest: 0,
    
    // Configurações para funcionamento do addon.
    config : {
         timeCheckTest : 500,
         testNamespace: '',
         testHost : '',
         testModule : ''
    },       

    /**
     * Atualiza os status dos resultados.
     * @returns {undefined}
     */
    upStatus : function(){
        this._getLabelSuccess().value = this._sucessTest + " Test(s)";
        this._getLabelError().value   = this._errosTest + " Test(s)";
        return this;
    },

    /**
     * Obter o icone a ser mostrado.
     * @returns {undefined}
     */
    _getLabelError : function(){
        return document.getElementsById("unittest-total-error");
        return this;
    },
    
    /**
     * Obter o icone a ser mostrado.
     * @returns {undefined}
     */
    _getLabelSuccess : function(){
        return document.getElementsById("unittest-total-test");
    },
   
    
    /**
     * Execute o recursive sobre os resultados obtidos.
     * @param {String} url
     * @param {String} filter
     * @param {int} nivel     
     */
    _recursiveResultado : function( url, filter, nivel ){
        
        var parseResult = function(){
            var elemTpAction = document.body.querySelectorAll('tr#tpAction');        
            var linkDetail   = elemTpAction.querySelectorAll('a');

            for( var indice in elemTpAction ){   
                // Somente até o resultado dos test unitário, caso queria os detalhes dos testes,
                // será necessário entrar mais um nível - Tiago G. Ribeiro
                if (nivel < 3){
                    var url = linkDetail[indice].href;
                    nivel++;
                    this._recursiveResultado( url , null, nivel );
                } else {
                    var elemTpNum    = document.body.querySelectorAll('tr#tpNum')[indice];
                    if (elemTpNum.innerHTML === "success"){
                        utilAddon._sucessTest++;
                    } else if (elemTpNum.innerHTML === "failed"){
                        utilAddon._errosTest++;
                    }
                }
            }    
        };
        
        utilAddon.load( url , filter  , parseResult );
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
                this._recursiveResultado( this.config.testHost, this._getFilter(), 0 )
                    .upStatus();
            },this.config.timeCheckTest );
        } catch(e) {
            console.warn("Falha monitoramento do addon-unittest - "+e.stack());
        }
    },
    
    // Inicializa o addon.
    startup : function(){
       
        // Carregando as preferencias(configurações)
        var preference = utilAddon.loadPrefs();
        this.config.testNamespace = preference.getPref("namespace");
        this.config.testModule    = preference.getPref("module");
        this.config.testHost      = preference.getPref("host");
        this.config.timeCheckTest = preference.getPref("timeCheck");
       
        // Iniciando o monitoramento dos testes
        if (this.config.testHost!=="" && this.config.testNamespace!=="")
            this._monitor();                
    }

};

window.addEventListener("load", function(e) { utilAddon.startup(); }, false);