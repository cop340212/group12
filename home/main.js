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
    // Get beginning of table body
    var displayTable = document.getElementById('output-table-body');
    // Loop for each row in response
    for (let i=0; i < myObj.length; i++) {
        var rec = [myObj[i].FirstName, myObj[i].LastName, myObj[i].Email, myObj[i].Phone];
        // Begin new row
        let newCell, newRow = document.createElement("tr");
        // Loop for each column in record
        for (let j=0; j < rec.length; j++) {
            newCell = document.createElement("td");
            newCell.innerHTML = rec[j];
            newRow.appendChild(newCell);
        }
        // Add modal to last column
        newCell = document.createElement("td");
        let modalButton = document.createElement("button");
        modalButton.type = "button";
        modalButton.setAttribute("class", "btn btn-link");
        modalButton.setAttribute("data-bs-toggle", "modal");
        modalButton.setAttribute("data-bs-target", "#aboutModal");
        modalButton.innerHTML = "Manage";
        newCell.appendChild(modalButton);
        newRow.appendChild(newCell);

        // Add completed record to the DOM
        displayTable.appendChild(newRow);
    }
}