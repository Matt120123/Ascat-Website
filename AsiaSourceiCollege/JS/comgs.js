// Function to show the custom alert
function showCustomAlert() {
    const alertElement = document.getElementById('customAlert');
    alertElement.classList.remove('hidden');
    alertElement.style.display = 'block'; // Ensure the alert is displayed

}

// Function to close the custom alert
function closeAlert() {
    const alertElement = document.getElementById('customAlert');    
    alertElement.classList.add('hidden');
    alertElement.style.display = 'none'; // Hide the alert

}

function sendEmail(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const branch = document.getElementById('branch').value;
    const grade = document.getElementById('grade').value;
    const lastname = document.getElementById('lastname').value;
    const firstname = document.getElementById('firstname').value;
    const middlename = document.getElementById('middlename').value;
    const number = document.getElementById('number').value;
    const schoolyear = document.getElementById('schoolyear').value;
    const message = document.getElementById('message').value;

    // Gather certificate selections
    const certificates = Array.from(document.querySelectorAll('input[name="certificate"]:checked'))
                              .map(input => input.value);

    // Prepare data to send
    const data = {
        BRANCH: branch,
        GRADE: grade,
        LASTNAME: lastname,
        FIRSTNAME: firstname,
        MIDDLENAME: middlename,
        CONTACTNUMBER: number,
        LASTSCHOOLYEAR: schoolyear,
        CERTIFICATES: certificates.join(', '), // Join selected certificates into a comma-separated string
        PURPOSE: message,
        sheetName: 'Request' // Specify the sheet name you want to use
    };

    // Define the URLs for different branches
    const urlTaguig = 'https://script.google.com/macros/s/AKfycbxed-Z1ZS86MH1BNixTI09BZbxsEMClup8TiPNWJ0sg7FgGd0ESmjxx1d0mb0NgbHP-/exec'; // Replace with your actual URL for Branch A
    const urlPasig = 'https://script.google.com/macros/s/AKfycbxPEPUaR6F_h43u2UI9K-5F320Qmla2VMHJaALRrbQycSvn7vt7uuU6e52NShCtj_cj/exec'; // Replace with your actual URL for Branch B

    // Choose the correct URL based on the selected branch
    let url;
    if (branch === 'Taguig') {
        url = urlTaguig;
    } else if (branch === 'Pasig') {
        url = urlPasig;
    } else {
        alert('Invalid branch selected');
        return;
    }

    // Send data to the chosen Google Apps Script Web App URL
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data) // Encode form data 
    })
    .then(response => {
        console.log('Server Response:', response); // Log the response for debugging
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        if (data.result === 'success') {
           showCustomAlert(); // Show custom alert on success
            document.querySelector('.contact form').reset(); // Optionally, reset the form
        } else {
            alert('Error: ' + data.error); // Show error message from server
        }
    })
    .catch(error => {
        alert('Error: ' + error.message); // Handle network errors
    });
}
