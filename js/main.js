"use strict";

const manageModal = document.getElementById('aboutModal');
// Function to update modal contents with corresponding record data
manageModal.addEventListener('show.bs.modal', event =>
    {
        // Button that triggered the modal
        const button = event.relatedTarget;
        let saveButton = document.getElementById("saveUpdate");

        // Check if editing existing contact (Manage button)
        if (button.classList.contains("myManageModalButton")) {
            // Make sure Delete button is showing
            document.getElementById("delete").classList.remove("visually-hidden");
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
            // Use more appropriate action word
            saveButton.innerHTML = "Save changes";
        }
        // Otherwise we opened modal with add new contact button
        else {
            // Clear the modal's content.
            manageModal.querySelector('#firstInput').value = "";
            manageModal.querySelector('#lastInput').value = "";
            manageModal.querySelector('#emailInput').value = "";
            manageModal.querySelector('#phoneInput').value = "";
            // Update and hide button text for relevance
            saveButton.innerHTML = "Save";
            document.getElementById("delete").classList.add("visually-hidden");
        }
    }
)

function modalAddNew(userID) {
    // Grab data fields from modal
    const firstName = manageModal.querySelector('#firstInput').value;
    const lastName = manageModal.querySelector('#lastInput').value;
    const email = manageModal.querySelector('#emailInput').value;
    const phone = manageModal.querySelector('#phoneInput').value;

    // Build POST request
    var url = "https://codegojolt.xyz/LAMPAPI/createContact.php";
    console.log("adding new contact...");
    var xmlhttp, newID, myObj = [];
    var payload = {"UserID": userID, "FirstName": firstName, "LastName": lastName, "Email": email, "Phone": phone};
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4) 
        {
            switch(this.status)
            {
                // OK
                case 200:
                    newID = JSON.parse(this.responseText).ID;
                    console.log(newID);
                    // Update modal with success message and switch to update mode
                    document.getElementById("delete").classList.remove("visually-hidden");
                    document.getElementById("saveUpdate").saveButton.innerHTML = "Save changes";
                    // Swap Contact ID for UserID and add new record to displayed results table
                    delete payload["UserID"];
                    payload["ID"] = newID;
                    myObj.push(payload);
                    let isLastShaded = document.getElementById('output-table-body').lastChild.classList.contains("table-light");
                    fillResponse(myObj, !isLastShaded);
                    break;
                // Contact already exists
                case 401:
                    console.log("Error 401: Contact already exists");
                    break;
                // Could Not Connect to Database
                case 403:
                    console.log("Error 401: Could Not Connect to Database");
                    break;
                // URL Not Found
                case 404:
                    console.log("Error 401: URL Not Found");
                    break;
                // \o/
                default:
                    console.log("What did you do to get here?!")
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(JSON.stringify(payload));
}

function modalUpdate(userID) {
    if (document.getElementById("saveUpdate").innerHTML = "Save")
    // Modal reached by clicking "New Contact" button
    {
        modalAddNew(userID);
    }
    else
    // Modal reached by clicking "Manage" button in a contact record
    {

    }
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
            fillResponse(myObj, 0);
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

function fillResponse(myObj, makeFirstShaded) {
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
        if ((i + makeFirstShaded) % 2 == 1) {
            newRow.setAttribute("class", "table-light");
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
        modalButton.setAttribute("class", "btn btn-link myManageModalButton");
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
