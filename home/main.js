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
    var obj, xmlhttp, myObj, x, txt = "";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // myObj = JSON.parse(this.responseText);
            // for (x in myObj) {
            //     txt += myObj[x].names + "<br>";
            // }
            // document.getElementById("arrayContent").innerHTML = txt;
            console.log(`Response = ${this}`);
            document.getElementById("test-all").innerHTML =
                          this.responseText;
        }
    };
    xmlhttp.open("GET", "https://codegojolt.xyz/LAMPAPI/getContacts.php?ID=4", true);
    xmlhttp.send();
}