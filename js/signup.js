"use strict";

// Nearly identical to signin.js
async function signUpFunc(userID) 
{
    var form = document.getElementById("verification");
    var firstPrompt = form.elements["floatingFirst"].value;
    var lastPrompt = form.elements["floatingLast"].value;
    var emailPrompt = form.elements["floatingEmail"].value;
    var phonePrompt = form.elements["floatingPhone"].value;
    var passwordPrompt = form.elements["floatingPassword"].value;
    var confirmPrompt = form.elements["floatingPasswordConfirm"].value;

    var url = "https://codegojolt.xyz/LAMPAPI/";
    if(passwordPrompt == confirmPrompt)
    {
        const returnVal = await verifyLogin(firstPrompt,lastPrompt, emailPrompt, phonePrompt,passwordPrompt, confirmPrompt, url);
        console.log(returnVal);

        document.getElementById("floatingPassword").setAttribute("class", "form-control");
        document.getElementById("floatingPasswordConfirm").setAttribute("class", "form-control");

        switch(returnVal)
        {
            case 200:
                console.log("Redirecting to hardcoded: /home/main.html");
                document.getElementById("floatingFirst").setAttribute("class", "form-control is-valid");
                document.getElementById("floatingLast").setAttribute("class", "form-control is-valid");
                document.getElementById("floatingEmail").setAttribute("class", "form-control is-valid");
                document.getElementById("floatingPhone").setAttribute("class", "form-control is-valid");
                document.getElementById("floatingPassword").setAttribute("class", "form-control is-valid");
                document.getElementById("floatingPasswordConfirm").setAttribute("class", "form-control is-valid");
                document.getElementById("errorText").setAttribute("class", "mt-3 mb-3 fst-italic fs-6 text-danger d-none");
                location.href = '/home/main.html';
                break;
            case 401:
                console.log("User Error: 401");
                document.getElementById("floatingEmail").setAttribute("class", "form-control is-invalid z-1");
                document.getElementById("errorText").setAttribute("class", "mt-3 mb-3 fst-italic fs-6 text-danger");
                break;
            case 403:
                console.log("Debug Error: 403");
                break;
            case 404:
                console.log("Debug Error: 404");
                break;
                
        }
    }
    else
    {
        console.log("User Error: 402");
        document.getElementById("floatingEmail").setAttribute("class", "form-control");
        document.getElementById("floatingPassword").setAttribute("class", "form-control is-invalid z-1");
        document.getElementById("floatingPasswordConfirm").setAttribute("class", "form-control is-invalid z-1");
    }
}

function verifyLogin(first, last, email, phone, password, confirmPrompt, url)
{
    var xmlhttp, payload = {"Email": email, "Password": password};
    url += "createUser.php";
    payload.FirstName = first;
    payload.LastName = last;
    payload.Email = email;
    payload.Phone = phone;
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
                        break;
                    case 403:
                        localStorage.setItem("userID", -1);
                        resolve(403);
                        break;
                    case 404:
                        localStorage.setItem("userID", -1);
                        resolve(404);
                        break;
                }
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.send(JSON.stringify(payload));
    });
}