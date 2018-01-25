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
  // Establishing the connection
  $conn = mysqli_connect($servername, $username, $password, $db);
	if ($conn->connect_error)
	{
		echo( $conn->connect_error );
	}
	else
	{
		$sql = "SELECT * FROM contacts WHERE firstname LIKE '$search_val%'";
		$result = $conn->query($sql);
		$my_arr = array();
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$my_arr[] = array(
					'firstname' => $row['firstname'],
					'lastname' => $row['lastname'],
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