function checkForm() {

    // Selects the input typed into the text fields
    var name_input = document.getElementById("name_field").value;
    var email_input = document.getElementById("email_field").value;
    var phone_input = document.getElementById("phone_field").value;
    var address_input = document.getElementById("address_field").value;

    // Select the labels that are ontop of the textfields, will turn red if
    // incorrect information has been entered
    var name_label = document.getElementById("name_label");
    var email_label = document.getElementById("email_label");
    var phone_label = document.getElementById("phone_label");
    var address_label = document.getElementById("address_label");

    var validate = true;

    if (name_input.value == "") {
        name_label.style.color = "red";
        name_label.style.fontStyle = "bold";
        validate = false;
    }
    if (email_input.value == "") {
        email_label.style.color = "red";
        email_label.style.fontStyle = "bold";
        validate = false;
    }
    if (phone_input.value == "") {
        phone_label.style.color = "red";
        phone_label.style.fontStyle = "bold";
        validate = false;
    }
    if (address_input.value == "") {
        address_label.style.color = "red";
        address_label.style.fontStyle = "bold";
        validate = false;
    }

    if (!validate) {
        alert("Please fill out all fields before submitting.");
        return false;
    }

    // if all of the appropriate data is filled out then we can create our contact object and call the data submission function
    var contact = new contactObject(name_input, email_input, phone_input, address_input);
    processSubmit(contact);
}

// contact object that will store all data relevant to a user
class contactObject {
    constructor(name, email, phone, address) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}

// handles the submission of relevant contact data in the form of json from the client to the server
function processSubmit(contact) {
    $.ajax({
        type: 'POST',
        url: 'script.php',
        contentType: 'json',
        data: {
			action: 'add',
			JSON.stringify(contact),
		},

        success: function (data) {
            alert("success");
            alert(data);
            document.getElementById("#myContainer").innerHTML = data;
            document.getElementById("contactTable").innerHTML = "<tr><td>Test</td></tr>";
        }
    });
}

