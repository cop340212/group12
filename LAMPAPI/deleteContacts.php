<?php

//Group 12
//COP 4331
//LAMP API deleteContacts

/*
   This is the api used to delete a contact from the database.
   It takes in the json data for the contact to be deleted, then
   returns the json of the contact that was deleted.
*/

//Gets the data as a json input
$inData = getRequestInfo();

//Saves all the data to local variables
$contactID = $inData["ID"];
$contactFirstName = $inData["FirstName"];
$contactLastName = $inData["LastName"];
$contactPhone = $inData["Phone"];
$contactEmail = $inData["Email"];
$contactUserID = $inData["UserID"];




//Connect to the database
$conn = new  mysqli("localhost", "admin", "password", "COP4331");


//If there is some error connecting to database
if ($conn->connect_error) 
{
	echo "Could not connect to server";
} 

else
{
   //Setup for the query that will be passed
   $sql = "DELETE FROM Contacts WHERE ID = '$contactID'" ;

   //If the delete is true then return 200 and the contact info that was deleted.
   if ($conn -> query($sql) === TRUE)
   {
      http_response_code(200);
      returnWithSuccess(array("ID" => $contactID, "FirstName" => $contactFirstName , "LastName" => $contactLastName, "Phone" => $contactPhone, "Email" => $contactEmail , "UserID" => $contactUserID));
   }
   else
   {
      echo "Could not delete";
   }

}

$conn->close();





function getRequestInfo()
{
   return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
   header('Content-type: application/json');
   echo $obj;
}


function returnWithSuccess ($input )
{
   sendResultInfoAsJson( json_encode($input) );   
}
?>
