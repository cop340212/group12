<?php

//Group 12
//COP 4331
//LAMP API updateContact

/*
   This api is used to update a contact info.
   It takes an input of the user and contact to change.
   Then returns the new data of the contact
*/

//Get input data
$inData = getRequestInfo();

//Save as local variables
$contactID = $inData["ID"];
$updatedFirstName = $inData["FirstName"];
$updatedLastName = $inData["LastName"];
$updatedPhone = $inData["Phone"];
$updatedEmail = $inData["Email"];




//Connect to database
$conn = new  mysqli("localhost", "admin", "password", "COP4331");


//If there is a connection error return
if ($conn->connect_error) 
{
   http_response_code(403);
   return;
} 

else
{
   //Set up an update query using the data aquired
   $sql = "UPDATE Contacts SET FirstName = '$updatedFirstName', LastName = '$updatedLastName', Phone = '$updatedPhone', Email = '$updatedEmail' WHERE ID = $contactID";

   //Makes sure that it can be updated properly
   if ($conn -> query($sql) === TRUE)
   {
      //Gets the new information just changed and saves for return
      $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE ID = ?");
      $stmt1->bind_param("s", $contactID);
      $stmt1->execute();
      $result = $stmt1->get_result();
      $row = $result->fetch_assoc();
      
      $fetchedFirstName = $row["FirstName"];
      $fetchedLastName = $row["LastName"];
      $fetchedEmail = $row["Email"];
      $fetchedPhone = $row["Phone"];
      $fetchedUserID = $row["UserID"];
      $fetchedID = $row["ID"];



      $finalResult = array("ID" => $fetchedID, "FirstName" => $fetchedFirstName , "LastName" => $fetchedLastName, "Phone" => $fetchedPhone, "Email" => $fetchedEmail , "UserID" => $fetchedUserID);
      returnWithSuccess($finalResult);
   }
   else
   {
      http_response_code(405);
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
