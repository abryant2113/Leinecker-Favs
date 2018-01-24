
<?php

	// ajax post data containing user and pass input
	$firstname = $_POST['firstname'];
	$lastname = $_POST['lastname'];
	$email = $_POST['email'];
	$user = $_POST['username'];
	$pass = $_POST['pass'];
	

	// db deets
    $servername = "localhost";
    $username = "root";
    $password = "";
    $db = "cop4331";
   
    // Establishing the connection
    $conn = mysqli_connect($servername, $username, $password, $db); 
	
	 // terminates if the connection fails
    if(!$conn)
        die('Error, could not connect:');

	// queries database to check for valid user
	$sql = "SELECT username, password FROM users WHERE username = '$user'";
	$result = $conn->query($sql);
	
	if(!$result)
		echo "Error";		

			
		$row = $result->fetch_assoc();
		$contains_username = $row["user"];
		
		if($contains_username == $user)
			echo "Username already exists";
		
		$sql = "INSERT into users (username, password, firstname, lastname, email) VALUES ('$user', '$pass', '$firstname', '$lastname', '$email')";	
		$result = $conn->query($sql);
		// test to see if insertion was successful
		if($result)
			echo "Verified";
	

    $conn->close();
	
	// example of verifying passwords matching within the db. We'll pull down the hashed password associated with the username and perform
	// a comparison. the right argument of the hash_equals function will be the hashed password pulled down from the db. If true, success. else, invalid pass.
	/*
	if(password_verify($password, $hashed_pass))
		echo('Verified');
	else
		echo('Invalid Password');
*/
?>
