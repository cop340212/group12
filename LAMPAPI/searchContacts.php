<?php

//Get JSON of the current user
$inData = getRequestInfo();



//Get only the ID from that user to know which user we are looking at
$userID = $inData["ID"];
$userSearch = $inData["Search"];

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
      //Push each contact to an array to return later
      array_push($allContacts, array("FirstName" => $fetchedFirstName, "LastName" => $fetchedLastName, "Email" => $fetchedEmail, "Phone" => $fetchedPhone));


   }

   $userSearch = strtolower($userSearch);
   $finalSearchedArray = array();

   foreach($allContacts as $contact)
   {


      if(str_contains(strtolower($contact["FirstName"]),$userSearch))
      {
         array_push($finalSearchedArray, $contact);
      }
      if(str_contains(strtolower($contact["LastName"]),$userSearch))
      {
         array_push($finalSearchedArray, $contact);
      }
      if(str_contains(strtolower($contact["Email"]),$userSearch))
      {
         array_push($finalSearchedArray, $contact);
      }

      $phoneSplit = preg_split('/[-|)|(]/', $contact["Phone"],-1, PREG_SPLIT_NO_EMPTY);
      $phoneOnlyNums = implode($phoneSplit);
      
      if(str_contains($phoneOnlyNums,$userSearch))
      {
         array_push($finalSearchedArray, $contact);
      }

   }

   returnWithSuccess($finalSearchedArray);



}

$conn->close();

function getRequestInfo()
{
   return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
   header('Content-type: application/json');
   print_r($obj);
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