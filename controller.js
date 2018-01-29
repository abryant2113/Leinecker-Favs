var urlBase = '';
var extension = "php";

var userId = 0;
var firstName = "";
var lastName = "";


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
					+ obj[i]["email"] + "</td><td>" + obj[i]["phone"] + "</td><td>" + obj[i]["address"] + "</td><td style=\"display:none;\">" + obj[i]["cid"]
						+ "</td><td><button type=\"reset\" onclick=deleteContact(this) id=\"delete-btn\">Delete</button></tr></form>";
        
			}
		}
    });
}

function processLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    var login = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    
    var specReg = /[^A-Za-z0-9 ]/;

    // checks for invalid characters in login attempt
    if(specReg.test(login) || specReg.test(password))
    {
        alert("Invalid characters found. Please try again.");
        return;
    }

    var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
    var url = urlBase + '/auth.' + extension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayload);
        var jsonObject = JSON.parse( xhr.responseText );

        if(jsonObject["error"] != null)
        {
            alert("User/Password combination incorrect");
            return;
        }
        user = jsonObject[0]["user"];
        document.cookie = user;
        window.location.href = "./contact.htm";
    }
    catch(err)
    {
        alert(err.message);
    }  
}

// checks for valid email using regex
function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// handles the creating of a new account -------------------------------------------------------------------------------------------------------
function createAccount() {
	
    var firstname = document.getElementById("firstname");
    var lastname = document.getElementById("lastname");
	var email = document.getElementById("email");
    var phone = document.getElementById("phone");
	var username = document.getElementById("username");
    var pass = document.getElementById("password");
    var confirm = document.getElementById("confirm");

    var fieldArray = [firstname, lastname, email, phone, username, pass, confirm];
    var validate = true;
    var specReg = /[^A-Za-z0-9 ]/;

    // for loop will iterate through all input fields and check to make sure that they are filled out
    for(var i = 0; i < 7; i++){
        
        var curVal = fieldArray[i].value;

        // checks to ensure that the fields are populated
        if(curVal.length <= 0){
            alert("Please fill out all fields before submitting.");
            validate = false;
            break;
        }

        // checks against email addresses
        if(i == 2){
            if(!validateEmail(fieldArray[i].value)){
                alert("Invalid Email Address.");
                validate = false;
                break;
            }
        }
        else if(specReg.test(fieldArray[i].value))
        {
            alert(fieldArray[i].value);
            alert("Invalid character(s) found. Please try again.");
            validate = false;
            break;
        }
    }

    // checks to see if the two password fields match.
    if(validate && (fieldArray[5].value != fieldArray[6].value)){
        alert("Password fields do not match. Please try again.");
        validate = false;
    }
	
    // only run the jquery 
    if(validate){

        $.ajax({
            type: 'POST',
            url: 'script.php',
            data: {
                action: 'create',
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value,
                username: username.value,
                pass: pass.value,
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

    // clears all forms
    for(var j = 0; j < 7; j++)
        fieldArray[j].value = '';
    	
}

// Handles entering a new contact for the user -------------------------------------------------------------------------------

function checkForm() {
	
    // Selects the input typed into the text fields
    var firstname_input = document.getElementById("firstname_field");
	var lastname_input = document.getElementById("lastname_field");
    var email_input = document.getElementById("email_field");
    var phone_input = document.getElementById("phone_field");
    var address_input = document.getElementById("address_field");

    // Select the labels that are ontop of the textfields, will turn red if
    // incorrect information has been entered
    var firstname_label = document.getElementById("firstname_label");
	var lastname_label = document.getElementById("lastname_label");
    var email_label = document.getElementById("email_label");
    var phone_label = document.getElementById("phone_label");
    var address_label = document.getElementById("address_label");

    var validate = true;
    var specReg = /[^A-Za-z0-9 ]/;
    var fieldArray = [firstname_input, lastname_input, email_input, phone_input, address_input];

    // iterates through all of the inputs to make sure that all fields are filled out
    for(var i = 0; i < 5; i++){
                
        var curVal = fieldArray[i].value;

        if(curVal.length <= 0){
            alert("Please fill out all fields before submitting.");
            validate = false;
            break;
        }

        // checks for invalid email addresses
        if(i == 2){
            if(!validateEmail(fieldArray[i].value)){
                alert("Invalid Email Address.");
                validate = false;
                break;
            }
        }
        else if(specReg.test(fieldArray[i].value))
        {
            alert(fieldArray[i].value);
            alert("Invalid character(s) found. Please try again.");
            validate = false;
            break;
        }

    }
	
    // if all of the appropriate data is filled out then we can create our contact object and call the data submission function
    if(validate){
        var contact = new contactObject(firstname_input.value, lastname_input.value, email_input.value, phone_input.value, address_input.value);
        processSubmit(contact);
    }

    // clears all of the fields on both success and failed add contact attempts
    for(var j = 0; j < 5; j++)
        fieldArray[j].value = '';

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
            document.getElementById("contactTable").innerHTML = "";
            populateTable();
		}
    });
}

// Search For Contacts
function searchContact()
{
    var srch = document.getElementById("searchText").value;
    var current_user = document.cookie;
    var specReg = /[^A-Za-z0-9 ]/;

    // doesn't allow invalid searches
    if(specReg.test(srch)){
        alert("Invalid character(s) found. Please only use alphanumerics while searching.");
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'search.php',
        data: {
            search: srch,
            current_user: current_user,
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
				{
					document.getElementById("contactTable").innerHTML += "<form method=\"post\"><tr class=\"dropdown\"><td>" + obj[i]["firstname"] + "</td><td>" + obj[i]["lastname"] + "</td><td>" 
					+ obj[i]["email"] + "</td><td>" + obj[i]["phone"] + "</td><td>" + obj[i]["address"] + "</td><td style=\"display:none;\">" + obj[i]["cid"]
						+ "</td><td><button type=\"reset\" onclick=deleteContact(this) id=\"delete-btn\">Delete</button></tr></form>";
				}
            }
        }
    });

}

// -----------------------------------------------------------------------------------------
// Editing and deleting contacts

function deleteContact(r)
{
	var x = r.parentNode.parentNode.rowIndex;
	
	y = document.getElementById('contactTable').rows[x - 1].cells[5].innerHTML;

	
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
            document.getElementById("contactTable").innerHTML = "";
            populateTable();
		}
    });	
}