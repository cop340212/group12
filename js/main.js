"use strict";

const manageModal = document.getElementById('aboutModal');
const modalAddNewHeader = "Add New Contact";
const modalEditExistingHeader = "Edit Contact Info";
const modalSaveNewButtonText = "Save";
const modalSaveUpdatesButtonText = "Save changes";
const error403Message = "Error 403: Could Not Connect to Database. Please try again.";
const error404Message = "Error 404: URL Not Found. Please make sure you are connected to the internet and try again.";
const errorUnknown = "Unknown Error: You should not see this message. We are doomed.";

// Function to update modal contents with corresponding record data
manageModal.addEventListener('show.bs.modal', event => 
{
    {
        // Button that triggered the modal
        const button = event.relatedTarget;
        let saveButton = document.getElementById("saveUpdate");

        // Hide message text area
        if (!document.getElementById("buttonMessages").classList.contains("visually-hidden"))
            document.getElementById("buttonMessages").classList.add("visually-hidden");
        }

        // Check if editing existing contact (Manage button)
        if (button.classList.contains("myManageModalButton")) {
            // Update header
            document.getElementById("aboutModalLabel").innerHTML = modalEditExistingHeader;
            // Make sure Delete button is showing
            document.getElementById("delete").classList.remove("visually-hidden");
            // Extract info from row fields
            const firstName = button.parentElement.parentElement.childNodes[0].innerHTML;
            const lastName = button.parentElement.parentElement.childNodes[1].innerHTML;
            const email = button.parentElement.parentElement.childNodes[2].innerHTML;
            const phone = button.parentElement.parentElement.childNodes[3].innerHTML;
            // Keep current modal record's ID in local storage for button function access
            const rowID = button.parentElement.parentElement.getAttribute("id");
            localStorage.setItem("currentModalContactID", Number.parseInt(rowID.substr(10)));
            // Update the modal's content.
            manageModal.querySelector('#firstInput').value = firstName;
            manageModal.querySelector('#lastInput').value = lastName;
            manageModal.querySelector('#emailInput').value = email;
            manageModal.querySelector('#phoneInput').value = phone;
            // Use more appropriate action word
            saveButton.innerHTML = modalSaveUpdatesButtonText;
        }
        // Otherwise we opened modal with add new contact button
        else {
            // Clear the modal's content.
            manageModal.querySelector('#firstInput').value = "";
            manageModal.querySelector('#lastInput').value = "";
            manageModal.querySelector('#emailInput').value = "";
            manageModal.querySelector('#phoneInput').value = "";
            // Update and hide button text for relevance
            document.getElementById("aboutModalLabel").innerHTML = modalAddNewHeader;
            saveButton.innerHTML = modalSaveNewButtonText;
            document.getElementById("delete").classList.add("visually-hidden");
        }
    }
)

// Logout function to clear local storage of userID and return user to signup/sign-in page
function userLogout() {
    localStorage.removeItem("userID");
    location.reload();
}

// Function called by modal saveUpdate button to add a new contact to a user's contacts list
function modalAddNew(userID) {
    // Grab data fields from modal
    const firstName = manageModal.querySelector('#firstInput').value;
    const lastName = manageModal.querySelector('#lastInput').value;
    const email = manageModal.querySelector('#emailInput').value;
    const phone = manageModal.querySelector('#phoneInput').value;

    // Validate Email and Phone format

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
            // Make response text area visible
            if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
                document.getElementById("buttonMessages").classList.remove("visually-hidden");
            switch(this.status)
            {
                // OK
                case 200:
                    newID = JSON.parse(this.responseText).ID;
                    console.log(`New contact created with ID = ${newID}`);
                    // Update modal with success message and switch to update mode
                    document.getElementById("buttonMessages").textContent = firstName + " was successfully added to your contacts.";
                    if (!document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-danger");
                        }
                    }
                    if (document.getElementById("firstInput").classList.contains("is-invalid"))
                        document.getElementById("firstInput").setAttribute("class", "form-control is-valid");
                    if (document.getElementById("lastInput").classList.contains("is-invalid"))
                        document.getElementById("lastInput").setAttribute("class", "form-control is-valid");
                    if (document.getElementById("emailInput").classList.contains("is-invalid"))
                        document.getElementById("emailInput").setAttribute("class", "form-control is-valid");
                    if (document.getElementById("phoneInput").classList.contains("is-invalid"))
                        document.getElementById("phoneInput").setAttribute("class", "form-control is-valid");
                    document.getElementById("delete").classList.remove("visually-hidden");
                    document.getElementById("saveUpdate").innerHTML = modalSaveUpdatesButtonText;
                    // Swap Contact ID for UserID and add new record to displayed results table
                    delete payload["UserID"];
                    payload["ID"] = newID;
                    myObj.push(payload);
                    let isLastShaded = document.getElementById('output-table-body').lastChild.classList.contains("table-light");
                    fillResponse(myObj, !isLastShaded);
                    // Keep current modal record's ID in local storage for button function access
                    localStorage.setItem("currentModalContactID", newID);
                    break;
                // Contact already exists
                case 401:
                    console.log("[Add Contact] Error 401: Contact already exists");
                    document.getElementById("buttonMessages").textContent = firstName + " " + lastName + " already exists in your contacts with phone number " + phone;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                        }
                    }
                    document.getElementById("firstInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("lastInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("phoneInput").setAttribute("class", "form-control is-invalid");
                    break;
                // Could Not Connect to Database
                case 403:
                    console.log("[Add Contact] Error 403: Could Not Connect to Database");
                    document.getElementById("buttonMessages").textContent = error403Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                        }
                    }
                    break;
                // URL Not Found
                case 404:
                    console.log("[Add Contact] Error 404: URL Not Found");
                    document.getElementById("buttonMessages").textContent = error404Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                        }
                    }
                    break;
                // \o/
                default:
                    console.log("[Add Contact] Unknown Error: What did you do to get here?!")
                    document.getElementById("buttonMessages").textContent = errorUnknown;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                        }
                    }
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(JSON.stringify(payload));
}

function modalUpdate(userID) {
    if (document.getElementById("saveUpdate").innerHTML == modalSaveNewButtonText)
    // Modal reached by clicking "New Contact" button
    {
        modalAddNew(userID);
    }
    else
    // Modal reached by clicking "Manage" button in a contact record
    {
        console.log("Entered update code...");
    }
}

function modalDelete(userID) {
    // Grab data fields from modal (and ID from corresponding DOM element)
    const firstName = manageModal.querySelector('#firstInput').value;
    const lastName = manageModal.querySelector('#lastInput').value;
    const email = manageModal.querySelector('#emailInput').value;
    const phone = manageModal.querySelector('#phoneInput').value;

    // Get ID for corresponding DOM element
    const contactID = localStorage.getItem("currentModalContactID");

    // Build POST request
    var url = "https://codegojolt.xyz/LAMPAPI/deleteContacts.php";
    console.log(`deleting contact ID ${contactID}...`);
    var xmlhttp, myObj;
    var payload = {"ID": contactID, "FirstName": firstName, "LastName": lastName, "Email": email, "Phone": phone, "UserID": userID};
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4) 
        {
            switch(this.status)
            {
                // OK
                case 200:
                    myObj = JSON.parse(this.responseText);
                    console.log(`Successfully deleted (${myObj["ID"]}) ${myObj["FirstName"]} ${myObj["LastName"]}, ${myObj["Email"]}, ${myObj["Phone"]}`);
                    // Update modal with success message and switch to add mode
                    document.getElementById("buttonMessagesTextArea").value = myObj["FirstName"] + " was successfully removed from your contacts.";
                    document.getElementById("buttonMessagesTextArea").classList.add("is-valid");
                    if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
                        document.getElementById("buttonMessages").classList.remove("visually-hidden");
                    document.getElementById("aboutModalLabel").innerHTML = modalAddNewHeader;
                    document.getElementById("delete").classList.add("visually-hidden");
                    document.getElementById("saveUpdate").innerHTML = modalSaveNewButtonText;
                    // Clear the modal's content.
                    manageModal.querySelector('#firstInput').value = "";
                    manageModal.querySelector('#lastInput').value = "";
                    manageModal.querySelector('#emailInput').value = "";
                    manageModal.querySelector('#phoneInput').value = "";
                    // Clear local storage contact ID
                    localStorage.removeItem("currentModalContactID");
                    // Delete this contact's row in DOM table
                    let delRow = document.getElementById("contactNum" + myObj["ID"].toString());
                    document.getElementById('output-table-body').removeChild(delRow);
                    break;
                // Could Not Connect to Database
                case 403:
                    console.log("[Delete Contact] Error 403: Could Not Connect to Database");
                    break;
                // URL Not Found
                case 404:
                    console.log("[Delete Contact] Error 404: URL Not Found");
                    break;
                // \o/
                default:
                    console.log("[Delete Contact] Unknown Error: What did you do to get here?!")
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(JSON.stringify(payload));
}

function myFunction(userID) {
    console.log(`myFunction called with userID = ${userID}`);
    if (!userID)
    {
        //window.location.replace("https://codegojolt.xyz/");
    }
    else {
        var x = document.getElementById("searchInput").elements[0].value;
        var url = "https://codegojolt.xyz/LAMPAPI/";
        getContacts(userID, url, x);
    }
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
        modalButton.setAttribute("id", "manageButton");
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
