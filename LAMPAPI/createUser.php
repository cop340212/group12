<?php


$inData = getRequestInfo();

$userFirstName = $inData["FirstName"];
$userLastName = $inData["LastName"];
$userEmail = $inData["Email"];
$userPhone = $inData["Phone"];
$userPassword = $inData["Password"];

$conn = new mysqli("localhost", "Tester", "Group12Rocks", "COP4331");


if ($conn->connect_error) 
{
   http_response_code(403);
} 

else
{
   $stmt1 = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
   $stmt1->bind_param("s", $userEmail);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();

   if($row = $result->fetch_assoc())
   {
      http_response_code(401);
   }
   else
   {

      $stmt2 = $conn->prepare("INSERT INTO Users (FirstName,LastName,Email,Phone,Password) VALUES (?,?,?,?,?)");
      $stmt2->bind_param("sssss", $userFirstName,$userLastName,$userEmail,$userPhone,$userPassword);

      $stmt2->execute();
      $stmt2->close();

      $stmt3 = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
      $stmt3->bind_param("s", $userEmail);
      $stmt3 ->execute();

      $result2 = $stmt3 -> get_result();
      $stmt3 -> close();
      $row2 = $result2 -> fetch_assoc();
      
      $id = $row2["ID"];

      
      returnWithSuccess($id);

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


function returnWithSuccess ($UserID )
{
   global  $userEmail, $userFirstName, $userLastName, $userPhone, $userPassword;
   $retValue = array("ID" => $UserID, "FirstName" => $userFirstName , "LastName" => $userLastName, "Phone" => $userPhone, "Password" => $userPassword , "Email" => $userEmail);
   header("Content-Type: application/json");
   sendResultInfoAsJson( json_encode($retValue) );
}
?>
