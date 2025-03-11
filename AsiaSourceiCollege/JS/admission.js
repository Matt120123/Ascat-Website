const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5501;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'admission' directory
app.use(express.static(path.join(__dirname, 'AsiaSourceiCollege')));
app.use('/src', express.static(path.join(__dirname, 'AsiaSourceiCollege/src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'AsiaSourceiCollege', 'Admission-Portal.html'));
});

// Define the email template **before** the POST endpoint
const emailTemplate = `
    <h1>Welcome to Our Enrollment Program</h1>
    <p>Dear Student,</p>
    <p>Thank you for submitting your admission form. Here are the next steps for enrollment:</p>
    <ul>
        <li>Step 1: Review your form details.</li>
        <li>Step 2: Pay the admission fee.</li>
        <li>Step 3: Visit the registrar with the necessary documents.</li>
    </ul>
    <p>Best regards,</p>
    <p>Asia Source iCollege</p>
    <img src="cid:SchoolLogo" alt="School Logo">
`;

// POST endpoint for form submission
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    console.log('Form Data Received:', formData);

    // Validate formData (example validation)
    if (!formData.studentEmailAddress) {
        console.error('Validation Error: Missing student email address');
        return res.status(400).json({ success: false, error: 'Missing student email address' });
    }

    // Simulate database entry (replace this with actual database logic)
    console.log('Saving data to the database...');

    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'luk.ellorimo1@gmail.com',  // your Gmail address
            pass: 'apvsczgnefbferqx'          // your app-specific password (no spaces)
        },
        tls: {
            rejectUnauthorized: false  // for development only
        }
    });

    // Email options
    let mailOptions = {
        from: 'luk.ellorimo1@gmail.com',
        to: formData.studentEmailAddress,
        subject: 'Enrollment Instructions',
        html: emailTemplate, // Ensure emailTemplate is defined before this line
        attachments: [{
            filename: 'SchoolLogo.png',
            path: path.join(__dirname, 'images', 'SchoolLogo.png'), // Corrected path
            cid: 'SchoolLogo' // same cid value as in the html img src
        }]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, error: error.message });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ success: true });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
