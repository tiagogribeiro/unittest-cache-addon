var panel = {
	addModule : function (test, isLeft) {
		var divModule = "";
		var divPanel = "";
		var li = "";
		
		divModule = document.createElement("div");
		divModule.className = ((isLeft == true) ? "module-div left" : "module-div");
						
		li = document.createElement("li");
		li.className ="text";
		li.innerHTML = "id: " + test.id;
		divModule.appendChild(li);

		li = document.createElement("li");
		li.className ="text";
		li.innerHTML = "Passou: " + test.passed;			
		divModule.appendChild(li);
			
		divPanel = document.getElementById("unittest-panel");
		divPanel.appendChild(divModule);			
	}, 
				
	load : function (object) {				
		var isLeft = "";
		for (var i=0;i<object.results.length;i++) {
			isLeft = ((i%2) != 0);
			this.addModule(object.results[i], isLeft);
		} 
	}	
}