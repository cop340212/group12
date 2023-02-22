<?php
//Group 12
//COP 4331
//LAMP API createContacts

/*
   This is the api used to create a contact from the database.
   This takes in data for the contact to create. Then returns
   the created contact and adds it to the database.
*/


//Gets input data
$inData = getRequestInfo();

//Save as local variables
$contactFirstName = $inData["FirstName"];
$contactLastName = $inData["LastName"];
$contactEmail = $inData["Email"];
$contactPhoneNumber = $inData["Phone"];
$contactUserID = $inData["UserID"];




//Connect to database
$conn = new  mysqli("localhost", "admin", "password", "COP4331");


//Returns if there is an error
if ($conn->connect_error) 
{
	  returnWithError( $conn->connect_error );
     http_response_code(403);
} 

else
{
   //Prepare all of the sql statments to see if it exists.
   $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ?");
   $stmt1->bind_param("sss",$contactFirstName, $contactLastName, $contactPhoneNumber);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();

   //Get all of the contacts that matched and if any match the one trying to be created return
   while ($row = $result->fetch_assoc())
   {
      if($contactUserID == $row["UserID"])
      {
         http_response_code(401);
         return;
      }
   }

      //If none exist then create contact into this location
      $stmt2 = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
      $stmt2->bind_param("issss", $contactUserID, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
     
      $stmt2->execute();
      $stmt2->close();

      //Get the contact that was just created so we can match the userID to return value
      $stmt3 = $conn->prepare("SELECT * FROM Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ?");
      $stmt3->bind_param("sss", $contactFirstName, $contactLastName, $contactPhoneNumber);
      $stmt3->execute();
      $result3 = $stmt3->get_result();
      $stmt3->close();
      while($row3 = $result3->fetch_assoc())
      {
         if ($contactUserID == $row3["UserID"])
            break;
      }


   $id = $row3["ID"];
   
   returnWithSuccess($id);
   

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

function returnWithSuccess ($id )
{
   global $contactUserID, $contactEmail, $contactFirstName, $contactLastName, $contactPhoneNumber;
   $retValue = array("ID" => $id, "FirstName" => $contactFirstName , "LastName" => $contactLastName, "Phone" => $contactPhoneNumber, "Email" => $contactEmail , "UserID" => $contactUserID);
   header("Content-Type: application/json");
   sendResultInfoAsJson( json_encode($retValue) );   
}
?>
