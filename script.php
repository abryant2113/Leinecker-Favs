<?php

	// Switch command
	if(isset($_POST['action']) && !empty($_POST['action'])) {

		$action = $_POST['action'];
		
		switch($action) {
			case 'create' : create_user();break;
			case 'add' : add_contact();break;
			case 'populate' : populate_table();break;
			case 'delete' : delete_contact(); break;
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

		// using prepared statements to guard against sql injection attacks
		$sql = $conn->prepare("SELECT first_name, last_name, phone, email, address, cid FROM contacts WHERE username_link = ?");
		$sql->bind_param("s", $current_user);

		$sql->execute();
		$result = $sql->get_result();

		$my_arr = array();

		while($row = $result->fetch_assoc())
		{
			$my_arr[] = array(
					'firstname' => $row['first_name'],
					'lastname' => $row['last_name'],
					'phone' => $row['phone'],
					'email' => $row['email'],
					'address' => $row['address'],
					'cid' => $row['cid']
				);
		}
		echo json_encode($my_arr);
		$conn->close();
		$sql->close();
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


		// using prepared statements to guard against sql injection attacks
		$sql = $conn->prepare("SELECT username, password FROM users WHERE username = ?");
		$sql->bind_param("s", $user);
		$sql->execute();
		$result = $sql->get_result();
		
		if(!$result)
			echo "Error";		

			$row = $result->fetch_assoc();
			$contains_username = $row["username"];
			
			if($contains_username == $user)
				echo "Username already exists";
			
			// hashing the password and inserting into the db
			$hashed_pass = crypt($pass, 'CRYPT_BLOWFISH');
			
			$sql = $conn->prepare("INSERT into users (username, password, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)");
			$sql->bind_param("sssss", $user, $hashed_pass, $firstname, $lastname, $email);
			$sql->execute();
			
			// test to see if insertion was successful
			if($sql)
				echo "Verified";

		$sql->close();
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
			
			$sql = $conn->prepare("INSERT INTO contacts(first_name, last_name, phone, email, address, username_link) VALUES (?, ?, ?, ?, ?, ?)");
			$sql->bind_param("ssssss", $new_first, $new_last, $new_phone, $new_email, $new_address, $current_user);
			$sql->execute();
		
			if(!$sql)
				echo "Fatal Error";
		}

		$sql->close();
		$conn->close();
	}
	

	function delete_contact()
	{
		// db deets
		$servername = "localhost";
		$username = "root";
		$password = "";
		$db = "cop4331";
		
		$phone = $_POST['phone'];
		$current_user = $_POST['current_user'];
		
		$conn = mysqli_connect($servername, $username, $password, $db);
		
		// terminates if the connection fails
		if(!$conn)
			die('Error, could not connect.');

		$sql = $conn->prepare("DELETE from contacts where cid = ? and username_link = ?");
		$sql->bind_param("ss", $phone, $current_user);
		$sql->execute();
			
		// checks to make sure that the sql statement was successful
		if(!$sql)
			echo "Fatal Error";
		
		$sql->close();
		$conn->close();
	}
?>
