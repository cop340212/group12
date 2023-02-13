<?php


$inData = getRequestInfo();


$contactID = $inData["ID"];
$updatedFirstName = $inData["FirstName"];
$updatedLastName = $inData["LastName"];
$updatedPhone = $inData["Phone"];
$updatedEmail = $inData["Email"];





$conn = new  mysqli("localhost", "admin", "password", "COP4331");



if ($conn->connect_error) 
{
   http_response_code(403);
} 

else
{
   $sql = "UPDATE Contacts SET FirstName = '$updatedFirstName', LastName = '$updatedLastName', Phone = '$updatedPhone', Email = '$updatedEmail' WHERE ID = $contactID";

   if ($conn -> query($sql) === TRUE)
   {
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

function returnWithError( $err )
{
   $retValue = '{"userID":"0","FirstName":"","LastName":"","Email":"","Phone":"","error":"' . $err . '"}';
   //  sendResultInfoAsJson( $retValue );
   echo "This Contact Already exists!";
}

function returnWithSuccess ($input )
{
   sendResultInfoAsJson( json_encode($input) );   
}
?>
