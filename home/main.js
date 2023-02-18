"use strict";

function myFunction() {
    var x = document.getElementById("searchInput").elements[0].value;
    if (x == "")
        getContacts();
    else
        document.getElementById("results").innerHTML = "Prompt search for: " + x;
  }

function getContacts(userId) {
    console.log("getting all contacts...");
    var xmlhttp, myObj;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("About to parse and assign to myObj")
            myObj = JSON.parse(this.responseText);
            fillResponse(myObj);
         }
    };
    xmlhttp.open("POST", "https://codegojolt.xyz/LAMPAPI/getContacts.php", true);
    xmlhttp.send(JSON.stringify({ "ID": 33 }));
}

function fillResponse(myObj) {
    var displayTable = document.getElementById('output-table-body');
    for (let i=0; i < myObj.length; i++) {
        var rec = [myObj[i].FirstName, myObj[i].LastName, myObj[i].Email, myObj[i].Phone];
        let newRow = document.createElement("tr");
        for (let j=0; j < rec.length; j++) {
            let newCell = document.createElement("td");
            newCell.innerHTML = rec[j];
            newRow.appendChild(newCell);
        }
        displayTable.appendChild(newRow);
        // document.getElementById("arrayContent").innerHTML = txt;
        // console.log(`Response = ${myObj}`);
        // document.getElementById("test-all").innerHTML =
        //           JSON.stringify(myObj);
    }
}