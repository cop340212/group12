"use strict";

// Credit to gil for the original code from main.js
async function signInFunc(userID) 
{
    var form = document.getElementById("verification");
    var emailPrompt = form.elements["floatingEmail"].value;
    var passwordPrompt = form.elements["floatingPassword"].value;
    var url = "https://codegojolt.xyz/LAMPAPI/";
    const returnVal = await verifyLogin(emailPrompt, passwordPrompt, url);
    console.log(returnVal);

    switch(returnVal)
    {
        case 200:
            console.log("Redirecting to hardcoded: /home/main.html");
            document.getElementById("floatingEmail").setAttribute("class", "form-control is-valid");
            document.getElementById("floatingPassword").setAttribute("class", "form-control is-valid");
            location.href = '/home/main.html';
            break;
        case 401:
            console.log("User Error: 401");
            document.getElementById("floatingEmail").setAttribute("class", "form-control is-invalid");
            break;    
        case 402:
            console.log("User Error: 402");
            document.getElementById("floatingPassword").setAttribute("class", "form-control is-invalid");
            document.getElementById("floatingEmail").setAttribute("class", "form-control is-valid");
            break;
        case 403:
            console.log("Debug Error: 403");
            break;
        case 403:
            console.log("Debug Error: 404");
            break;
    }
}

function verifyLogin(email, password, url)
{
    var xmlhttp, myObj, payload = {"Email": email, "Password": password};
    url += "Login.php";
    payload.Email = email;
    payload.Password = password;

    // Debug
    console.log(`url = ${url}`);
    console.log(`JSON = ${JSON.stringify(payload)}`);
    return new Promise(function (resolve) 
    {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() 
        {
            if (this.readyState == 4) 
            {
                switch(this.status)
                {
                    case 200:
                        console.log(JSON.parse(this.responseText).ID);
                        localStorage.setItem("userID", JSON.parse(this.responseText).ID);
                        resolve(200);
                        break;
                    case 401:
                        localStorage.setItem("userID", -1);
                        resolve(401);
                    case 402:
                        localStorage.setItem("userID", -1);
                        resolve(402);
                    case 403:
                        localStorage.setItem("userID", -1);
                        resolve(403);
                    case 404:
                        localStorage.setItem("userID", -1);
                        resolve(404);
                }
                this
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.send(JSON.stringify(payload));
    });
}