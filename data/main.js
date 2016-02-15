"use strict";
var panel = {
        addModule : function (oJson, isLeft) {
                var divModule = "";
                var divPanel = "";
                var li = "";

                divModule = document.createElement("div");
                divModule.className = ((isLeft == true) ? "module-div left" : "module-div");				

                li = document.createElement("li");
                li.className ="text";
                li.innerHTML = "Modulo: " + oJson.module;
                divModule.appendChild(li);

                li = document.createElement("li");
                li.className ="text";
                li.innerHTML = "Testes: " + oJson.test;
                divModule.appendChild(li);

                li = document.createElement("li");
                li.className ="text";
                li.innerHTML = "Erros: " + oJson.error;
                divModule.appendChild(li);

                divPanel = document.getElementById("unittest-panel");
                divPanel.appendChild(divModule);

        }, 

        // @param json: {"list":[{"module":"est", "test":"10", "error":"2"}, {"module":"fin", "test":"5", "error":"0"}]}
        load : function (json) {				
                var isLeft = "";
                var oList = JSON.parse(json);

                for (var i=0;i<oList.list.length;i++) {
                        isLeft = ((i%2) != 0);
                        this.addModule(oList.list[i], isLeft);
                } 
        }	
}



