<?php
	  $searchResults = "";
	  $searchCount = 0;
	
	  // db deets
 	  $servername = "localhost";
	  $username = "root";
	  $password = "";
	  $db = "cop4331";
	  $count = 0;
	  $search_val = $_POST['search'];
	  $current_user = $_POST['current_user'];
	  
	  // Establishing the connection
	  $conn = mysqli_connect($servername, $username, $password, $db);
		if ($conn->connect_error)
		{
			echo( $conn->connect_error );
		}
		else
		{
			// prepared statement to defend against sql injection attacks
			$sql = $conn->prepare("SELECT * FROM contacts WHERE (first_name LIKE CONCAT (?, '%') OR last_name LIKE CONCAT (?, '%')) and username_link = ?");
			$sql->bind_param("sss", $search_val, $search_val, $current_user);
			$sql->execute();
			$result = $sql->get_result();
			$my_arr = array();
			if ($result->num_rows > 0)
			{
				while($row = $result->fetch_assoc())
				{
					$my_arr[] = array(
						'firstname' => $row['first_name'],
						'lastname' => $row['last_name'],
						'phone' => $row['phone'],
						'email' => $row['email'],
						'address' => $row['address']
					);
					$count++;
				}
					echo json_encode($my_arr);
			}
			else
			{
				echo("fail");
			}
			$conn->close();
		}
?>