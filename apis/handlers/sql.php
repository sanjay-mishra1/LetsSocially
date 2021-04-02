<?php
$_POST = json_decode(file_get_contents('php://input'), true);
$query=$_POST["query"];
    if(!$query)
       die(json_encode (array ("status"=>'Fail','error'=>'No query found ')));
$servername = "localhost";
$username = "id15842612_root";
$password = "EFyt*+F+4gR6T7#X";
$database = "id15842612_records";

// Create connection
$conn = new mysqli($servername, $username, $password,$database);

// Check connection
if ($conn->connect_error) {
  die(json_encode (array ("status"=>'Fail','error'=>"Connection failed: " . $conn->connect_error)));
}
$fields=[];
$queryResult= "'[";
$status='success';
$message='';
$result = mysqli_query($conn, $query) or die(json_encode (array ("status"=>'Fail','error'=>mysqli_error($conn))));
$totalResult=0;
if (!is_bool($result))
 $totalResult = mysqli_num_rows($result);
if ($totalResult==0) {  
    $message='Query executed successfully';
}else{
  // Get field information for all fields
  while ($fieldinfo = $result -> fetch_field()) {
    array_push($fields,$fieldinfo -> name);
  }
  $seperator='"';
     while ($row = mysqli_fetch_row($result)) {
$rowSize=count($row);
  $queryResult=$queryResult. '{';      
        for ($x = 0; $x < $rowSize; $x++) {
            $queryResult=$queryResult.$seperator.$fields[$x].$seperator.':'.$seperator.$row[$x].$seperator;
            if($x!=$rowSize-1)
                $queryResult=$queryResult.',';

            
        }
        $queryResult=$queryResult.'},';      
     }
     $queryResult=substr($queryResult,0,-1);
     $message='Found '.$totalResult.' results';
 $result -> free_result();
}
$queryResult=$queryResult."]'";     
 
$responseData=json_decode(substr($queryResult,1,-1));
switch (json_last_error()) {
        
        case JSON_ERROR_DEPTH:
            $message= ' - Maximum stack depth exceeded '.$queryResult;
            $status='Fail';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            $message= ' - Underflow or the modes mismatch '.$queryResult;
            $status='Fail';
        break;
        case JSON_ERROR_CTRL_CHAR:
            $message= ' - Unexpected control character found '.$queryResult;
            $status='Fail';
        break;
        case JSON_ERROR_SYNTAX:
            $message= ' - Syntax error, malformed JSON '.$queryResult;
            $status='Fail';
        break;
        case JSON_ERROR_UTF8:
            $message= ' - Malformed UTF-8 characters, possibly incorrectly encoded '.$queryResult;
            $status='Fail';
        break;
        
    }

echo json_encode(array("message"=>$message,"status"=>$status,"result"=>$responseData));

$conn->close();
?>