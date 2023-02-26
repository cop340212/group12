"use strict";

// Credit to gil for the original code from main.js
function myFunction(userID) 
{
    var emailPrompt = document.getElementById("floatingEmail").elements[0].value;
    var passwordPrompt = document.getElementById("floatingPassword").elements[0].value;
    var url = "https://codegojolt.xyz/LAMPAPI/";
    verifyLogin(emailPrompt, passwordPrompt, url);
}

function verifyLogin(email, password)
{
    console.log("Verifying user: " + email + " : " + password);
    var xmlhttp, myObj, payload = {"Email": userId, "Password": password};
    url += "login.php";
    payload.Email = email;
    payload.Password = password;

    // Debug
    console.log(`url = ${url}`);
    console.log(`JSON = ${JSON.stringify(payload)}`);

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4) 
        {
            switch(this.status)
            {
                case 200:
                    console.log("About to parse and assign to myObj");
                    break;
                case 401:
                    console.log("Common Error 401: Username Does Not Exist");
                    return false;
                case 402:
                    console.log("Common Error 402: Username Does Not Exist");
                    return false;
                case 403:
                    console.log("Debug Error 403: Could Not Connect to Database");
                    return null;
                case 404:
                    console.log("Debug Error 404: URL Not Found");
                    return null;
            }
            
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send(JSON.stringify(payload));
}