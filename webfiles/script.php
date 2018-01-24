<?php
	STATIC $current_user;
	
	// Switch command
	if(isset($_POST['action']) && !empty($_POST['action'])) {

		$action = $_POST['action'];

		switch($action) {
			case 'login' : login_user();break;
			case 'create' : create_user();break;
			case 'add' : add_contact();break;
			case 'populate' : populate_table();break;
		}
	}
	
	function populate_table(){
		
		// db deets
		$servername = "localhost";
		$username = "root";
		$password = "";
		$db = "cop4331";

		// grabs the current user's info
		$current_user = $_POST['current_user'];

		// Establishing the connection
		$conn = mysqli_connect($servername, $username, $password, $db); 
		
		 // terminates if the connection fails
		if(!$conn)
			die('Error, could not connect:');

		$sql = "SELECT firstname, lastname, phone, email, address FROM contacts WHERE username_link = '$current_user'";

		$result = $conn->query($sql);
		$my_arr = array();

		while($row = mysqli_fetch_array($result))
		{
			$my_arr[] = array(
					'firstname' => $row['firstname'],
					'lastname' => $row['lastname'],
					'phone' => $row['phone'],
					'email' => $row['email'],
					'address' => $row['address']
				);
		}
		echo json_encode($my_arr);
	}

	function login_user(){
		
	
		// ajax post data containing user and pass input
		
		$unverified_username = $_POST['user'];
		$unverified_password = $_POST['pass'];
		// hashes the password using php's built-in crypt function
		$hashed_unver_pass = crypt($unverified_password, 'CRYPT_BLOWFISH');
		
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
			$sql = "SELECT username, password FROM users WHERE username = '$unverified_username'";
			$result = $conn->query($sql);
			
			if(!$result)
				echo "Username does not exist";
			
			$row = $result->fetch_assoc();
			$verified_username = $row["username"];
			$verified_password = $row["password"];
			
			$hashed_ver_pass = $verified_password;
        
			// Password verification
			if($hashed_unver_pass != $hashed_ver_pass)
				$result = "Incorrect password.";
			else
				$result = "Verified";
			
			#$current_user = $verified_username;
			echo json_encode(array(
					'result' => $result,
					'current_user' => $verified_username
				));
		}
		$conn->close();
	}
	
	function create_user(){
		
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
			
			// hashing the password and inserting into the db
			$hashed_pass = crypt($pass, 'CRYPT_BLOWFISH');
			$sql = "INSERT into users (username, password, firstname, lastname, email) VALUES ('$user', '$hashed_pass', '$firstname', '$lastname', '$email')";	
			$result = $conn->query($sql);
			// test to see if insertion was successful
			if($result)
				echo "Verified";
		

		$conn->close();
	}

	function add_contact(){
		
		 // db deets
		$servername = "localhost";
		$username = "root";
		$password = "";
		$db = "cop4331";
	
		// change this portion
		//$contact_json = file_get_contents('php://input');
		$contact_json = $_POST['contactObj'];
		$contact_info = json_decode($contact_json);
		// Establishing the connection
		$conn = mysqli_connect($servername, $username, $password, $db); 

		$current_user = $_POST['current_user'];

		// terminates if the connection fails
		if(!$conn)
			die('Error, could not connect:');

		if($contact_info){
			$new_first = $contact_info->firstname;
			$new_last = $contact_info->lastname;
			$new_phone = $contact_info->phone;
			$new_email = $contact_info->email;
			$new_address = $contact_info->address;
			
			$sql = "INSERT INTO contacts(firstname, lastname, phone, email, address, username_link) VALUES ('$new_first', '$new_last', '$new_phone', '$new_email', '$new_address', '$current_user')";
			
			$check = $conn->query($sql);
			if(!$check)
				echo "Fatal Error";
		}
		$conn->close();
	}

?>