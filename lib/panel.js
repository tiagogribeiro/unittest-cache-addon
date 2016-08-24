var panel = {
	addModule : function (test, isLeft) {
		var divModule = "";
		var divPanel = "";
		var li = "";
		var textPassed = "";
		
		divModule = document.createElement("div");
		if (test.passed == true) {
			divModule.className = ((isLeft == true) ? "module-div module-passed left" : "module-div module-passed");
			textPassed = "Sucess!";
		} else {
			divModule.className = ((isLeft == true) ? "module-div module-error left" : "module-div module-error");
			textPassed = "Error!";
		}
		divModule.onclick = function () { addon.port.emit("load-suite", test.link); };
		
						
		li = document.createElement("li");
		li.className ="text";
		li.innerHTML = "Suite " + test.id;
		divModule.appendChild(li);

		li = document.createElement("li");
		li.className ="text";
		li.innerHTML = textPassed;			
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