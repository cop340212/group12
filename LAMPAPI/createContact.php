<?php


$inData = getRequestInfo();


$contactFirstName = $inData["FirstName"];
$contactLastName = $inData["LastName"];
$contactEmail = $inData["Email"];
$contactPhoneNumber = $inData["Phone"];
$contactUserID = $inData["UserID"];





$conn = new  mysqli("localhost", "admin", "password", "COP4331");



if ($conn->connect_error) 
{
	//  returnWithError( $conn->connect_error );
	echo "Could not connect to server";
} 

else
{
   $stmt1 = $conn->prepare("SELECT * FROM Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ?");
   $stmt1->bind_param("sss",$contactFirstName, $contactLastName, $contactPhoneNumber);
   $stmt1->execute();
   $result = $stmt1->get_result();

   $stmt1->close();
   while ($row = $result->fetch_assoc())
   {
      if($contactUserID == $row["UserID"])
      {
         print_r($row);
         echo "This contact already exists!";
         return;
      }
   }

      $stmt2 = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
      $stmt2->bind_param("issss", $contactUserID, $contactFirstName, $contactLastName, $contactEmail, $contactPhoneNumber);
     
      $stmt2->execute();
      $stmt2->close();

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
