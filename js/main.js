"use strict";

const manageModal = document.getElementById('aboutModal');
// Function to update modal contents with corresponding record data
manageModal.addEventListener('show.bs.modal', event =>
    {
        // Button that triggered the modal
        const button = event.relatedTarget;

        // Check if editing existing contact (Manage button)
        if (button.innerHTML == "Manage") {
            // Extract info from row fields
            const firstName = button.parentElement.parentElement.childNodes[0].innerHTML;
            const lastName = button.parentElement.parentElement.childNodes[1].innerHTML;
            const email = button.parentElement.parentElement.childNodes[2].innerHTML;
            const phone = button.parentElement.parentElement.childNodes[3].innerHTML;
            // Update the modal's content.
            manageModal.querySelector('#firstInput').value = firstName;
            manageModal.querySelector('#lastInput').value = lastName;
            manageModal.querySelector('#emailInput').value = email;
            manageModal.querySelector('#phoneInput').value = phone;
        }
        // Otherwise we opened modal with add new contact button
        else {
            // Clear the modal's content.
            manageModal.querySelector('#firstInput').value = "";
            manageModal.querySelector('#lastInput').value = "";
            manageModal.querySelector('#emailInput').value = "";
            manageModal.querySelector('#phoneInput').value = "";
            // Update and hide button text for relevance
            //TBD
        }
    }
)

function modalAddNew(userID) {

}

function modalUpdate(userID) {

}

function modalDelete(userID) {

}

function myFunction(userID) {
    var x = document.getElementById("searchInput").elements[0].value;
    var url = "https://codegojolt.xyz/LAMPAPI/";
    getContacts(userID, url, x);
}

function getContacts(userID, url, search) {
    console.log("getting all contacts...");
    var xmlhttp, myObj, payload = {"ID": userID};
    // Search box empty
    if (search == "")
        url += "getContacts.php";
    // Use search box input
    else {
        url += "searchContacts.php";
        payload.Search = search;
    // document.getElementById("results").innerHTML = "Prompt search for: " + x;
}
    // Debug
    // console.log(`url = ${url}`);
    // console.log(`JSON = ${JSON.stringify(payload)}`);

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("About to parse and assign to myObj")
            myObj = JSON.parse(this.responseText);
            clearResults();
            fillResponse(myObj);
         }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(JSON.stringify(payload));
}

function clearResults() {
    // Get beginning of table body
    var displayTable = document.getElementById('output-table-body');
    // Loop through and remove all children
    while (displayTable.lastElementChild && displayTable.lastElementChild != document.getElementById("addButtonRow")) {
        displayTable.removeChild(displayTable.lastElementChild);
    }
}

function fillResponse(myObj) {
    // Get beginning of table body
    var displayTable = document.getElementById('output-table-body');
    // Loop for each row in response
    for (let i=0; i < myObj.length; i++) {
        var rec = [myObj[i].ID, myObj[i].FirstName, myObj[i].LastName, myObj[i].Email, myObj[i].Phone];
        // Begin new row
        let newCell, newRow = document.createElement("tr");
        let rowID = "contactNum" + rec[0].toString();
        newRow.setAttribute("id", rowID);
        // Alternate light shading
        if (i % 2 == 1) {
            newRow.setAttribute("class", "table-secondary");
        }
        // Loop for each column in record
        for (let j=1; j < rec.length; j++) {
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

document.addEventListener('DOMContentLoaded', myFunction(localStorage.getItem("userID")), false);
