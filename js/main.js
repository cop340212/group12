"use strict";

const manageModal = document.getElementById('aboutModal');
const modalAddNewHeader = "Add New Contact";
const modalEditExistingHeader = "Edit Contact Info";
const modalSaveNewButtonText = "Save";
const modalSaveUpdatesButtonText = "Save changes";
const error403Message = "Error 403: Could Not Connect to Database. Please try again.";
const error404Message = "Error 404: URL Not Found. Please make sure you are connected to the internet and try again.";
const error405Message = "Error 405: Unknown Database Error, possibly due to updated contact info already matching an existing contact.";
const errorUnknown = "Unknown Error: You should not see this message. We are doomed.";

// Function to update modal contents with corresponding record data
manageModal.addEventListener('show.bs.modal', event => 
    {
        // Button that triggered the modal
        const button = event.relatedTarget;
        let saveButton = document.getElementById("saveUpdate");

        // Clear valid/invalid classes from from
        if (document.getElementById("firstInput").classList.contains("is-invalid"))
            document.getElementById("firstInput").classList.remove("is-invalid");
        if (document.getElementById("lastInput").classList.contains("is-invalid"))
            document.getElementById("lastInput").classList.remove("is-invalid");
        if (document.getElementById("emailInput").classList.contains("is-invalid"))
            document.getElementById("emailInput").classList.remove("is-invalid");
        if (document.getElementById("phoneInput").classList.contains("is-invalid"))
            document.getElementById("phoneInput").classList.remove("is-invalid");
        if (document.getElementById("firstInput").classList.contains("is-valid"))
            document.getElementById("firstInput").classList.remove("is-valid");
        if (document.getElementById("lastInput").classList.contains("is-valid"))
            document.getElementById("lastInput").classList.remove("is-valid");
        if (document.getElementById("emailInput").classList.contains("is-valid"))
            document.getElementById("emailInput").classList.remove("is-valid");
        if (document.getElementById("phoneInput").classList.contains("is-valid"))
            document.getElementById("phoneInput").classList.remove("is-valid");
        if (document.getElementById("firstInputDiv").classList.contains("errorForeground"))
            document.getElementById("firstInputDiv").classList.remove("errorForeground");
        if (document.getElementById("lastInputDiv").classList.contains("errorForeground"))
            document.getElementById("lastInputDiv").classList.remove("errorForeground");
        if (document.getElementById("emailInputDiv").classList.contains("errorForeground"))
            document.getElementById("emailInputDiv").classList.remove("errorForeground");
        if (document.getElementById("phoneInputDiv").classList.contains("errorForeground"))
            document.getElementById("phoneInputDiv").classList.remove("errorForeground");

        // Hide message text area
        if (!document.getElementById("buttonMessages").classList.contains("visually-hidden"))
            document.getElementById("buttonMessages").classList.add("visually-hidden");

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

    if(verifyFields(firstName,lastName,email,phone) != 0)
    {
        if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
            document.getElementById("buttonMessages").classList.remove("visually-hidden");
        displayFailedVerification(verifyFields(firstName,lastName,email,phone), email,phone);
        return;
    }
    // Build POST request
    var url = "https://codegojolt.xyz/LAMPAPI/createContact.php";
    console.log("adding new contact...");
    var xmlhttp, newID, myObj = [];
    var digits = phone.replace(/\D/g, "");
    var modified = digits.replace( /(\d\d\d)(\d\d\d)(\d\d\d\d)/g,  "($1)-$2-$3" );
    var payload = {"UserID": userID, "FirstName": firstName, "LastName": lastName, "Email": email, "Phone": modified};
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
                    document.getElementById("buttonMessages").innerHTML = firstName + " was successfully added to your contacts.";
                    if (!document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-danger");
                        }
                    }
                    displayFailedVerification(0, email,phone);
                    document.getElementById("delete").classList.remove("visually-hidden");
                    document.getElementById("saveUpdate").innerHTML = modalSaveUpdatesButtonText;
                    // Swap Contact ID for UserID and add new record to displayed results table
                    delete payload["UserID"];
                    payload["ID"] = newID;
                    myObj.push(payload);
                    if(document.getElementById('output-table-body').childElementCount > 0)
                    {
                        let isLastShaded = document.getElementById('output-table-body').lastChild.classList.contains("table-light");
                        fillResponse(myObj, !isLastShaded);
                    } 
                    else
                    {
                        fillResponse(myObj, 0);
                    }
                        
                    // Keep current modal record's ID in local storage for button function access
                    localStorage.setItem("currentModalContactID", newID);
                    break;
                // Contact already exists
                case 401:
                    console.log("[Add Contact] Error 401: Contact already exists");
                    document.getElementById("buttonMessages").innerHTML = firstName + " " + lastName + " already exists in your contacts with phone number " + phone;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
                    document.getElementById("firstInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("lastInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("emailInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("phoneInput").setAttribute("class", "form-control is-invalid");
                    document.getElementById("firstInputDiv").setAttribute("class", "form-floating errorForeground");
                    document.getElementById("lastInputDiv").setAttribute("class", "form-floating errorForeground");
                    document.getElementById("emailInputDiv").setAttribute("class", "form-floating errorForeground");
                    document.getElementById("phoneInputDiv").setAttribute("class", "form-floating errorForeground");
                    break;
                // Could Not Connect to Database
                case 403:
                    console.log("[Add Contact] Error 403: Could Not Connect to Database");
                    document.getElementById("buttonMessages").innerHTML = error403Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
                    break;
                // URL Not Found
                case 404:
                    console.log("[Add Contact] Error 404: URL Not Found");
                    document.getElementById("buttonMessages").innerHTML = error404Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
                    break;
                // \o/
                default:
                    console.log("[Add Contact] Unknown Error: What did you do to get here?!")
                    document.getElementById("buttonMessages").innerHTML = errorUnknown;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
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
        // Grab data fields from modal (and ID from corresponding DOM element)
        const firstName = manageModal.querySelector('#firstInput').value;
        const lastName = manageModal.querySelector('#lastInput').value;
        const email = manageModal.querySelector('#emailInput').value;
        const phone = manageModal.querySelector('#phoneInput').value;
        if(verifyFields(firstName,lastName,email,phone) != 0)
        {
            if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
                document.getElementById("buttonMessages").classList.remove("visually-hidden");
            displayFailedVerification(verifyFields(firstName,lastName,email,phone),email,phone)
            return;
        }
        // Get ID for corresponding DOM element
        const contactID = localStorage.getItem("currentModalContactID");

        // Build POST request
        var url = "https://codegojolt.xyz/LAMPAPI/updateContact.php";
        console.log(`updating contact ID ${contactID}...`);
        var xmlhttp, myObj;
        var digits = phone.replace(/\D/g, "");
        var modified = digits.replace( /(\d\d\d)(\d\d\d)(\d\d\d\d)/g,  "($1)-$2-$3" );
        var payload = {"ID": contactID, "FirstName": firstName, "LastName": lastName, "Email": email, "Phone": modified};
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function()
        {
            if (this.readyState == 4) 
            {
                if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
                document.getElementById("buttonMessages").classList.remove("visually-hidden");
                switch(this.status)
                {
                    // OK
                    case 200:
                        myObj = JSON.parse(this.responseText);
                        console.log(`Successfully updated (${myObj["ID"]}); saved as ${myObj["FirstName"]} ${myObj["LastName"]}, ${myObj["Email"]}, ${myObj["Phone"]}`);
                        // Update modal with success message and switch to add mode
                        document.getElementById("buttonMessages").innerHTML = myObj["FirstName"] + " was successfully updated in your contacts.";
                        displayFailedVerification(0,email,phone)
                        if (!document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-success");
                            if (document.getElementById("buttonMessages").classList.contains("text-danger"))
                            {
                                document.getElementById("buttonMessages").classList.remove("text-danger");
                            }
                        }
                        // Update this contact's row in DOM table
                        let updateRow = document.getElementById("contactNum" + myObj["ID"].toString());
                        updateRow.childNodes[0].innerHTML = myObj["FirstName"];
                        updateRow.childNodes[1].innerHTML = myObj["LastName"];
                        updateRow.childNodes[2].innerHTML = myObj["Email"];
                        updateRow.childNodes[3].innerHTML = myObj["Phone"];
                        break;
                    // Could Not Connect to Database
                    case 403:
                        console.log("[Update Contact] Error 403: Could Not Connect to Database");
                        document.getElementById("buttonMessages").innerHTML = error403Message;
                        if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                            if (document.getElementById("buttonMessages").classList.contains("text-success"))
                            {
                                document.getElementById("buttonMessages").classList.remove("text-success");
                            }
                        }
                        break;
                        // URL Not Found
                    case 404:
                        console.log("[Update Contact] Error 404: URL Not Found");
                        document.getElementById("buttonMessages").innerHTML = error404Message;
                        if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                            if (document.getElementById("buttonMessages").classList.contains("text-success"))
                            {
                                document.getElementById("buttonMessages").classList.remove("text-success");
                            }
                        }
                        break;
                        case 405:
                            console.log("[Update Contact] Error 405: Unknown database error");
                            document.getElementById("buttonMessages").innerHTML = error405Message;
                            if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                            {
                                document.getElementById("buttonMessages").classList.add("text-danger");
                                if (document.getElementById("buttonMessages").classList.contains("text-success"))
                                {
                                    document.getElementById("buttonMessages").classList.remove("text-success");
                                }
                            }
                            break;
                            // \o/
                    default:
                        console.log("[Update Contact] Unknown Error: What did you do to get here?!")
                        document.getElementById("buttonMessages").innerHTML = errorUnknown;
                        if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.add("text-danger");
                            if (document.getElementById("buttonMessages").classList.contains("text-success"))
                            {
                                document.getElementById("buttonMessages").classList.remove("text-success");
                            }
                        }
                    }
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.send(JSON.stringify(payload));
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
            if (document.getElementById("buttonMessages").classList.contains("visually-hidden"))
            document.getElementById("buttonMessages").classList.remove("visually-hidden");
            switch(this.status)
            {
                // OK
                case 200:
                    myObj = JSON.parse(this.responseText);
                    console.log(`Successfully deleted (${myObj["ID"]}) ${myObj["FirstName"]} ${myObj["LastName"]}, ${myObj["Email"]}, ${myObj["Phone"]}`);
                    // Update modal with success message and switch to add mode
                    document.getElementById("buttonMessages").innerHTML = myObj["FirstName"] + " was successfully removed from your contacts.";
                    if (!document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-success");
                        if (document.getElementById("buttonMessages").classList.contains("text-danger"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-danger");
                        }
                    }
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
                    document.getElementById("buttonMessages").innerHTML = error403Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
                    break;
                // URL Not Found
                case 404:
                    console.log("[Delete Contact] Error 404: URL Not Found");
                    document.getElementById("buttonMessages").innerHTML = error404Message;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
                    break;
            // \o/
                default:
                    console.log("[Delete Contact] Unknown Error: What did you do to get here?!")
                    document.getElementById("buttonMessages").innerHTML = errorUnknown;
                    if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                    {
                        document.getElementById("buttonMessages").classList.add("text-danger");
                        if (document.getElementById("buttonMessages").classList.contains("text-success"))
                        {
                            document.getElementById("buttonMessages").classList.remove("text-success");
                        }
                    }
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
        window.location.replace("https://codegojolt.xyz/");
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

function verifyFields(first,last,emailAddress,phone)
{
    const phoneRe = new RegExp(/^((([0-9]{3}))|([0-9]{3}))[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/);
    const emailRe = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
    var digits = phone.replace(/\D/g, "");

    if(first == "")
    {
        return 1;
    }
    else if (last == "")
    {
        return 2;
    }
    else if (emailRe.test(emailAddress) == false)
    {
        return 3;
    }
    else if(phoneRe.test(digits) == false)
    {
        return 4;
    }
    else
    {
        return 0;
    }
}

function displayFailedVerification(errorCode, email, phone)
{
    switch(errorCode)
        {
            case 0:
                if (!document.getElementById("firstInput").classList.contains("is-valid"))
                {
                    document.getElementById("firstInput").classList.add("is-valid");
                    if (document.getElementById("firstInput").classList.contains("is-invalid"))
                        document.getElementById("firstInput").classList.remove("is-invalid");
                    if (document.getElementById("firstInputDiv").classList.contains("errorForeground"))
                        document.getElementById("firstInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("lastInput").classList.contains("is-valid"))
                {
                    document.getElementById("lastInput").classList.add("is-valid");
                    if (document.getElementById("lastInput").classList.contains("is-invalid"))
                        document.getElementById("lastInput").classList.remove("is-invalid");
                    if (document.getElementById("lastInputDiv").classList.contains("errorForeground"))
                        document.getElementById("lastInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("emailInput").classList.contains("is-valid"))
                {
                    document.getElementById("emailInput").classList.add("is-valid");
                    if (document.getElementById("emailInput").classList.contains("is-invalid"))
                        document.getElementById("emailInput").classList.remove("is-invalid");
                    if (document.getElementById("emailInputDiv").classList.contains("errorForeground"))
                        document.getElementById("emailInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("phoneInput").classList.contains("is-valid"))
                {
                    document.getElementById("phoneInput").classList.add("is-valid");
                    if (document.getElementById("phoneInput").classList.contains("is-invalid"))
                        document.getElementById("phoneInput").classList.remove("is-invalid");
                    if (document.getElementById("phoneInputDiv").classList.contains("errorForeground"))
                        document.getElementById("phoneInputDiv").classList.remove("errorForeground");
                }
                return;
            case 1:
                document.getElementById("buttonMessages").innerHTML = "Please input a valid first name.";
                if (document.getElementById("firstInput").classList.contains("is-valid"))
                    document.getElementById("firstInput").classList.remove("is-valid");
                if (!document.getElementById("firstInput").classList.contains("is-invalid"))
                    document.getElementById("firstInput").classList.add("is-invalid");
                if (!document.getElementById("firstInputDiv").classList.contains("errorForeground"))
                    document.getElementById("firstInputDiv").classList.add("errorForeground");
                if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                {
                    document.getElementById("buttonMessages").classList.add("text-danger");
                    if (document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                    }
                }
                return;
            case 2:
                document.getElementById("buttonMessages").innerHTML = "Please input a valid last name.";
                if (!document.getElementById("firstInput").classList.contains("is-valid"))
                {
                    document.getElementById("firstInput").classList.add("is-valid");
                    if (document.getElementById("firstInput").classList.contains("is-invalid"))
                        document.getElementById("firstInput").classList.remove("is-invalid");
                    if (document.getElementById("firstInputDiv").classList.contains("errorForeground"))
                        document.getElementById("firstInputDiv").classList.remove("errorForeground");
                }
                if (document.getElementById("lastInput").classList.contains("is-valid"))
                    document.getElementById("lastInput").classList.remove("is-valid");
                if (!document.getElementById("lastInput").classList.contains("is-invalid"))
                    document.getElementById("lastInput").classList.add("is-invalid");
                if (!document.getElementById("lastInputDiv").classList.contains("errorForeground"))
                    document.getElementById("lastInputDiv").classList.add("errorForeground");
                if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                {
                    document.getElementById("buttonMessages").classList.add("text-danger");
                    if (document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                    }
                }
                return;
            case 3:
                document.getElementById("buttonMessages").innerHTML = email + " is not a valid email.";
                if (!document.getElementById("firstInput").classList.contains("is-valid"))
                {
                    document.getElementById("firstInput").classList.add("is-valid");
                    if (document.getElementById("firstInput").classList.contains("is-invalid"))
                        document.getElementById("firstInput").classList.remove("is-invalid");
                    if (document.getElementById("firstInputDiv").classList.contains("errorForeground"))
                        document.getElementById("firstInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("lastInput").classList.contains("is-valid"))
                {
                    document.getElementById("lastInput").classList.add("is-valid");
                    if (document.getElementById("lastInput").classList.contains("is-invalid"))
                        document.getElementById("lastInput").classList.remove("is-invalid");
                    if (document.getElementById("lastInputDiv").classList.contains("errorForeground"))
                        document.getElementById("lastInputDiv").classList.remove("errorForeground");
                }
                if (document.getElementById("emailInput").classList.contains("is-valid"))
                    document.getElementById("emailInput").classList.remove("is-valid");
                if (!document.getElementById("emailInput").classList.contains("is-invalid"))
                    document.getElementById("emailInput").classList.add("is-invalid");
                if (!document.getElementById("emailInputDiv").classList.contains("errorForeground"))
                    document.getElementById("emailInputDiv").classList.add("errorForeground");
                if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                {
                    document.getElementById("buttonMessages").classList.add("text-danger");
                    if (document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                    }
                }
                return;
            case 4:
                if (!document.getElementById("firstInput").classList.contains("is-valid"))
                {
                    document.getElementById("firstInput").classList.add("is-valid");
                    if (document.getElementById("firstInput").classList.contains("is-invalid"))
                        document.getElementById("firstInput").classList.remove("is-invalid");
                    if (document.getElementById("firstInputDiv").classList.contains("errorForeground"))
                        document.getElementById("firstInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("lastInput").classList.contains("is-valid"))
                {
                    document.getElementById("lastInput").classList.add("is-valid");
                    if (document.getElementById("lastInput").classList.contains("is-invalid"))
                        document.getElementById("lastInput").classList.remove("is-invalid");
                    if (document.getElementById("lastInputDiv").classList.contains("errorForeground"))
                        document.getElementById("lastInputDiv").classList.remove("errorForeground");
                }
                if (!document.getElementById("emailInput").classList.contains("is-valid"))
                {
                    document.getElementById("emailInput").classList.add("is-valid");
                    if (document.getElementById("emailInput").classList.contains("is-invalid"))
                        document.getElementById("emailInput").classList.remove("is-invalid");
                    if (document.getElementById("emailInputDiv").classList.contains("errorForeground"))
                        document.getElementById("emailInputDiv").classList.remove("errorForeground");
                }
                if (document.getElementById("phoneInput").classList.contains("is-valid"))
                    document.getElementById("phoneInput").classList.remove("is-valid");
                if (!document.getElementById("phoneInput").classList.contains("is-invalid"))
                    document.getElementById("phoneInput").classList.add("is-invalid");
                document.getElementById("buttonMessages").innerHTML = phone + " is not a valid phone number. Please follow the NANP format: XXX-XXX-XXXX.";
                if (!document.getElementById("phoneInputDiv").classList.contains("errorForeground"))
                    document.getElementById("phoneInputDiv").classList.add("errorForeground");
                if (!document.getElementById("buttonMessages").classList.contains("text-danger"))
                {
                    document.getElementById("buttonMessages").classList.add("text-danger");
                    if (document.getElementById("buttonMessages").classList.contains("text-success"))
                    {
                        document.getElementById("buttonMessages").classList.remove("text-success");
                    }
                }
                return;
        }
}
