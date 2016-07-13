"use strict";

var CELL_ID = 1;
var CELL_HREF = 1;
var CELL_PASSED = 2; 

function testsPerformed( body ) {
	var rowOfTest, link, id, i, testPassed;
	var resultList = new Array();
	
	
	for (i=0;i<4;i++) {
		rowOfTest = body.getElementsByClassName("tpRow")[i];				
		if (typeof rowOfTest != "object") break;
		
		id = rowOfTest.cells[CELL_ID].childNodes[0].innerHTML;	
		link = rowOfTest.cells[CELL_ID].childNodes[0].href;	
		testPassed = (rowOfTest.cells[CELL_PASSED].childNodes[0].color == "green");
		
		resultList.push({"id":id,"passed":testPassed,"link":link})		
	}	
	
	return {"results": resultList }
		
}

exports.testsPerformed = testsPerformed;
