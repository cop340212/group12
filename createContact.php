<?php


$inData = getRequestInfo();

$contactUserID = $inData["UserID"];
$contactFirstName = $inData["FirstName"];
$contactLastName = $inData["LastName"];
$contactEmail = $inData["Email"];
$contactPhoneNumber = $inData["Phone"];



$conn = new mysqli("localhost", "Tester", "Group12Rocks", "COP4331");

if ($conn->connect_error) 
{
   returnWithError( $conn->connect_error );
} 

else
{
   $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE Phone = ? AND UserID = ?");
   $stmt1->bind_param("ss", $contactPhoneNumber, $contactUserID);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();

   if($row = $result->fetch_assoc())
   {
      returnWithError("This contact already exists!");
   }
   else
   {
      $stmt2 = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
      $stmt2->bind_param("issss", $contactUserID, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
      $stmt2->execute();
      $addContact = $stmt2->get_result();
      $stm2->close();
      returnWithSuccess();

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

function returnWithError( $err )
{
   $retValue = '{"UserID":"0","FirstName":"","LastName":"","Email":"","Phone":"","error":"' . $err . '"}';
   sendResultInfoAsJson( $retValue );
}

function returnWithSuccess ( )
{
   global $contactUserID, $contactEmail, $contactFirstName, $contactLastName, $contactPhoneNumber;
   $retValue ='{"UserID":"'. $contactUserID .'","FirstName":"' . $contactFirstName . '","LastName":"' . $contactLastName . '","Email":"' . $contactEmail . '","Phone":"' . $contactPhoneNumber . '","error":""}';
   sendResultInfoAsJson( $retValue );
}
?>