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
        if ( keyPref === null) throw ("Chave para preferencia deve ser enviada.");
        if (this.prefs !== null )
            return this.prefs.getCharPref( keyPref );
        else
            throw ("Preferencias não carregada.");
    }
};

var AddonUnitTest = {             

    // Configurações para funcionamento do addon.
    config : {
         timeCheckTest : 500,
         testNamespace: '',
         testHost : '',
         testModule : ''
    },
    
    getCountSuccess : function(){

    },

    getCountErros : function(){

    },

    getIconStatus : function(){

    },


    /**
     * Obtem os resultados e adiciona as variaveis de monitoramento.
     * @param {type} results
     * @returns {undefined}
     */
    _callbackMonitor : function( results ){
        if (results !== null || results !== ""){
             alert("Buscou os dados..."+results);
        }
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
            var addon = this.AddonUnitTest;
            var ajax   = this.ajax; 
            window.setTimeout(function(){
                utilAddon.load( addon.config.testHost, addon._getFilter() , addon._callbackMonitor );
                addon.monitorTest();
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
        this._monitor();
        
    },
    
    shutdown: function(){}

};

window.addEventListener("load", function(e) { utilAddon.startup(); }, false);
window.addEventListener("unload", function(e) { utilAddon.shutdown(); }, false);