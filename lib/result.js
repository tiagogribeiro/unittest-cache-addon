"use strict";

var CELL_ID = 1;
var CELL_HREF = 1;
var CELL_PASSED = 2;
var CELL_TIME = 5;

function testsPerformed( body ) {
	var rowOfTest, link, id, i, testPassed, time;
	var resultList = new Array();


	for (i=0;i<4;i++) {
		rowOfTest = body.getElementsByClassName("tpRow")[i];
		if (typeof rowOfTest != "object") break;

		id = rowOfTest.cells[CELL_ID].childNodes[0].innerHTML;
		link = rowOfTest.cells[CELL_HREF].childNodes[0].href;
		time = rowOfTest.cells[CELL_TIME].innerHTML;
		testPassed = (rowOfTest.cells[CELL_PASSED].childNodes[0].color == "green");

		resultList.push({"id":id,"passed":testPassed,"link":link, "time":time})
	}

	return {"results": resultList }

}

exports.testsPerformed = testsPerformed;
