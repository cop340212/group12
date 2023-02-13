<?php

//Get JSON of the current user
$inData = getRequestInfo();


//Get only the ID from that user to know which user we are looking at
$userID = $inData["ID"];

$finalContactsArray = array();

//Make a new connection to the database
$conn = new mysqli("localhost", "Tester", "Group12Rocks", "COP4331");

//If there is some sort of connection error returns with error
if ($conn->connect_error) 
{
   returnWithError( $conn->connect_error );
   http_response_code(403);
} 
else
{
   //Prepares a connection in which it will get all the contacts where the UserID is equal
   $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ?");
   $stmt1->bind_param("s", $userID);
   $stmt1->execute();

   //Gets the result returned as Mysqli object of the above statement from the database
   $result = $stmt1->get_result();

   $allContacts = array();

   //Decodes the mysqli object and puts into row
   while($row = $result->fetch_assoc())
   {
      //Data from array needed
      $fetchedFirstName = $row["FirstName"];
      $fetchedLastName = $row["LastName"];
      $fetchedEmail = $row["Email"];
      $fetchedPhone = $row["Phone"];
      $fetchedID = $row["ID"];

      //Echoes each contact as a JSON element

      array_push($allContacts,array( "ID" => $fetchedID ,"FirstName" => $fetchedFirstName, "LastName" => $fetchedLastName, "Email" => $fetchedEmail, "Phone" => $fetchedPhone));
   }

   returnWithSuccess($allContacts);

   $conn->close();

}



function getRequestInfo()
{
   return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
   header('Content-type: application/json');
   echo $obj;
}

function returnWithError( $err )
{
   $retValue = array("ID" => -1, "FirstName" => "", "LastName" => "", "Email" => "", "Phone" => "");

   sendResultInfoAsJson(json_encode($retValue));
}

function returnWithSuccess ( $retValue )
{

   sendResultInfoAsJson(json_encode($retValue));
}
?>