function signOut(){
    window.location.href = "./index.htm";
}

function populateTable(){
    
    var current_user = document.cookie;

    $.ajax({
        type: 'POST',
        url: 'script.php',
        data: {
            action: 'populate',
            current_user: current_user,
        },

        success: function (data) {
            var json = data;
            document.getElementById("headerGreeting").innerHTML = "Welcome, " + current_user + "!";
            var obj = JSON.parse(json);
            var arrayLength = obj.length;

            // populates the contact table
            for(var i = 0; i < arrayLength; i++)
			{
                document.getElementById("contactTable").innerHTML += "<form method=\"post\"><tr class=\"dropdown\"><td>" + obj[i]["firstname"] + "</td><td>" + obj[i]["lastname"] + "</td><td>" 
					+ obj[i]["email"] + "</td><td>" + obj[i]["phone"] + "</td><td>" + obj[i]["address"] 
						+ "</td><td><div class=\"dropdownContent\"><button type=\"submit\" onclick=edit()>Edit</button><button type=\"submit\" onclick=deleteContact(this)>Delete</button></div></tr></form>";
        
			}
		}
    });
}

// handles the submission user login data from the client to the server
function processLogin() {

    var user_field = document.getElementById("inputEmail").value;
    var pass_field = document.getElementById("inputPassword").value;

    $.ajax({
        type: 'POST',
        url: 'script.php',
        data: {
			action: 'login',
            user: user_field,
            pass: pass_field,
        },

        success: function (data) {
            // checks to see if the password was valid or not
            var json = data;
            var obj = JSON.parse(json);

            current_user = obj["current_user"];
            document.cookie = current_user;

            if (obj["result"] == "Verified"){
                window.location.href = "./contact.htm";
            }
            else
                alert("Invalid credentials.");
        }
    });
}

// handles the creating of a new account -------------------------------------------------------------------------------------------------------
function createAccount() {
	
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
	var email = document.getElementById("email").value;
	var username = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
	
	$.ajax({
        type: 'POST',
        url: 'script.php',
        data: {
			action: 'create',
            firstname: firstname,
			lastname: lastname,
			email: email,
			username: username,
            pass: pass,
        },

        success: function (data) {
			
            // checks to see if the password was valid or not
            if (data == "Verified")
                window.location.href = "./index.htm";
            else
                alert(data);
        }
    });
}

// Handles entering a new contacct for the user -------------------------------------------------------------------------------

function checkForm() {
	
    // Selects the input typed into the text fields
    var firstname_input = document.getElementById("firstname_field").value;
	var lastname_input = document.getElementById("lastname_field").value;
    var email_input = document.getElementById("email_field").value;
    var phone_input = document.getElementById("phone_field").value;
    var address_input = document.getElementById("address_field").value;

    // Select the labels that are ontop of the textfields, will turn red if
    // incorrect information has been entered
    var firstname_label = document.getElementById("firstname_label");
	var lastname_label = document.getElementById("lastname_label");
    var email_label = document.getElementById("email_label");
    var phone_label = document.getElementById("phone_label");
    var address_label = document.getElementById("address_label");

    var validate = true;

    if (firstname_input == "") {
      //  name_label.style.color = "red";
        //name_label.style.fontStyle = "bold";
        validate = false;
    }
	if (lastname_input == "") {
        //name_label.style.color = "red";
        //name_label.style.fontStyle = "bold";
        validate = false;
    }
    if (email_input == "") {
        //email_label.style.color = "red";
        //email_label.style.fontStyle = "bold";
        validate = false;
    }
    if (phone_input == "") {
    //    phone_label.style.color = "red";
      //  phone_label.style.fontStyle = "bold";
        validate = false;
    }
    if (address_input == "") {
        //address_label.style.color = "red";
        //address_label.style.fontStyle = "bold";
        validate = false;
    }

    if (!validate) {
        alert("Please fill out all fields before submitting.");
        return false;
    }
	
    // if all of the appropriate data is filled out then we can create our contact object and call the data submission function
    var contact = new contactObject(firstname_input, lastname_input, email_input, phone_input, address_input);
    processSubmit(contact);
	
}


// contact object that will store all data relevant to a user
class contactObject {
    constructor(firstname, lastname, email, phone, address) {
		this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}

// handles the submission of relevant contact data in the form of json from the client to the server
function processSubmit(contact) {

    var current_user = document.cookie;

    $.ajax({
        type: 'POST',
        url: 'script.php',
        data: {
			action: 'add',
			contactObj: JSON.stringify(contact),
	        current_user: current_user,
    	},

        success: function (data) {
            alert("Sucessfully added contact");
            //document.getElementById("#myContainer").innerHTML = data;
            document.getElementById("contactTable").innerHTML += "<tr><td>" + contact.firstname + "</td><td>" + contact.lastname + "</td><td>" + contact.email + "</td><td>" + contact.phone + "</td><td>" + contact.address + "</td><td></tr>";
			document.getElementById("myForm").reset();
		}
    });
}
// Search For Contacts
function searchContact()
{
    var srch = document.getElementById("searchText").value;

    $.ajax({
        type: 'POST',
        url: 'search.php',
        data: {
            search: srch,
        },

        success: function (data) {
            var json = data;
            
            if(json == "fail"){
                document.getElementById("contactTable").innerHTML = "<center style=\"position: absolute; padding-top: 20px\">No contacts found.</center>";
            }
            else{
                var obj = JSON.parse(json);
                var arrayLength = obj.length;
                document.getElementById("contactTable").innerHTML = "";
                // populates the contact table
                for(var i = 0; i < arrayLength; i++)
                    document.getElementById("contactTable").innerHTML += "<form method=\"post\"><tr class=\"dropdown\"><td>" + obj[i]["firstname"] + "</td><td>" + obj[i]["lastname"] + "</td><td>" 
					+ obj[i]["email"] + "</td><td>" + obj[i]["phone"] + "</td><td>" + obj[i]["address"] 
						+ "</td><td><div class=\"dropdownContent\"><button type=\"submit\" onclick=edit()>Edit</button><button type=\"submit\" onclick=deleteContact(this)>Delete</button></div></tr></form>";
        
            }
        }
    });

}

// -----------------------------------------------------------------------------------------
// Editing and deleting contacts

function deleteContact(r)
{
	var x = r.parentNode.parentNode.parentNode.rowIndex;
	
	y = document.getElementById('contactTable').rows[x - 1].cells[3].innerHTML;

	
	var current_user = document.cookie;

    $.ajax({
        type: 'POST',
        url: 'script.php',
        data: {
			action: 'delete',
			phone: y,
	        current_user: current_user,
    	},

        success: function (data) {
            alert("Sucessfully deleted contact");
			document.getElementById('contactTable').innerHTML = "";
			populateTable();
		}
    });
	
}
