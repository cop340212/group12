<?php

//Group 12
//COP 4331
//LAMP API createUser

/*
   This api is used to create a new user into the database.
   This takes in the json input of the user to create.
   Then it adds it to the database and returns it.
*/

//Get data
$inData = getRequestInfo();

//Save as local variables
$userFirstName = $inData["FirstName"];
$userLastName = $inData["LastName"];
$userEmail = $inData["Email"];
$userPhone = $inData["Phone"];
$userPassword = $inData["Password"];

//Connect to database
$conn = new mysqli("localhost", "Tester", "Group12Rocks", "COP4331");

//If there was a connection error return
if ($conn->connect_error) 
{
   http_response_code(403);
} 

else
{
   //Prepare the check to make sure there is no other user with this email
   $stmt1 = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
   $stmt1->bind_param("s", $userEmail);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();

   //If the email matches return
   if($row = $result->fetch_assoc())
   {
      http_response_code(401);
   }
   else
   {
      //Since email doesnt exist put it into the database
      $stmt2 = $conn->prepare("INSERT INTO Users (FirstName,LastName,Email,Phone,Password) VALUES (?,?,?,?,?)");
      $stmt2->bind_param("sssss", $userFirstName,$userLastName,$userEmail,$userPhone,$userPassword);

      $stmt2->execute();
      $stmt2->close();

      //Get the User just created to get the ID
      $stmt3 = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
      $stmt3->bind_param("s", $userEmail);
      $stmt3 ->execute();

      $result2 = $stmt3 -> get_result();
      $stmt3 -> close();
      $row2 = $result2 -> fetch_assoc();
      
      $id = $row2["ID"];

      //Returns with the new user
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
