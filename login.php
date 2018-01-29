<?php

		// ajax post data containing user and pass input
		//$firstname = $_POST['firstname'];
		//$lastname = $_POST['lastname'];
		//$email = $_POST['email'];
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		

		// db deets
		$servername = "contactmanager-db.mysql.database.azure.com";
		$username = "cmadmin@contactmanager-db";
		$password = "5proc!$0oS21";
		$db = "contact_manager";
	   
		// Establishing the connection
		$conn = new mysqli($servername, $username, $password, $db); 
		echo($conn->connect_error);
		// Establishing the connection
		 // terminates if the connection fails
		echo("dude");
?>