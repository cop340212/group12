<?php


$inData = getRequestInfo();

$userLogin = $inData["Email"];
$userPassword = $inData["Password"];



$conn = new mysqli("localhost", "Tester", "Group12Rocks", "COP4331");

if ($conn->connect_error) 
{
   returnWithError( $conn->connect_error );
} 

else
{
   $stmt1 = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
   $stmt1->bind_param("s", $userLogin);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();

   if($row = $result->fetch_assoc())
   {
      $fetchedPassword = $row["Password"];
      $fetchedUserID = $row["ID"];
      $fetchedFirstName = $row["FirstName"];
      $fetchedLastName = $row["LastName"];
      $fetchedEmail = $row["Email"];
      $fetchedPhone = $row["Phone"];

      if ($fetchedPassword == $userPassword)
      {
         returnWithSuccess($fetchedUserID, $fetchedFirstName, $fetchedLastName, $fetchedEmail, $fetchedPhone);
      }
      else
      {
	 //returnWithError("The password you used was incorrect try again");
	 echo "The password you used was incorrect try again";
      }

   }
   else
   {
	 //  returnWithError("This Email does not exist!");
	 echo "This Email does not exist!";
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
   $retValue = array("ID" => -1, "FirstName" => "", "LastName" => "", "Email" => "", "Phone" => "");

   sendResultInfoAsJson(json_encode($retValue));
}

function returnWithSuccess ( $id, $firstName, $lastName, $email, $phone )
{
   $retValue = array("ID" => $id, "FirstName" => $firstName, "LastName" => $lastName, "Email" => $email, "Phone" => $phone);

   sendResultInfoAsJson(json_encode($retValue));
}
?>
