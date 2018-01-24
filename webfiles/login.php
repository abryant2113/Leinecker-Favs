<?php

	// ajax post data containing user and pass input
	$unverified_username = $_POST['user'];
	$unverified_password = $_POST['pass'];

	// hashes the password using php's built-in crypt function
	$hashed_pass = password_hash($unverified_password, PASSWORD_DEFAULT);


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

	if($conn){
		$username = $unverified_username;
		
		// Query the database for the username
		//$search_user = "SELECT username FROM users WHERE username = '$username'";
		
		$sql = "SELECT username, password FROM users WHERE username = '$unverified_username'";
		$result = $conn->query($sql);
		
		if(!$result)
			echo "Username does not exist";
		
		$row = $result->fetch_assoc();
		$verified_username = $row["username"];
		$verified_password = $row["password"];
		
		// Password verification
		// Will add hashing eventually
		
		if($verified_password != $unverified_password)
			echo "Incorrect password.";
		else
			echo "Verified";
		
		// Check if $password and $user_password match
		//if($unverified_password == password_verify($user_password, $hashed_pass))
	
	}

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