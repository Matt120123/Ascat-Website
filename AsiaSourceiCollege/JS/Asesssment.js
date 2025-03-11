document.addEventListener("DOMContentLoaded", function () {
    const formSections = document.querySelectorAll(".form-section");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");
    const progressBar = document.querySelectorAll(".progress-bar .step");
    const submitButton = document.getElementById("submit-btn");
    const printButton = document.getElementById("print-btn");
    const downloadButton = document.getElementById("download-btn");
    let currentSection = 0;

    window.onbeforeunload = function () {
        return "Are you sure you want to leave? Your changes will not be saved.";
    };

    function showSection(index) {
        formSections.forEach((section, i) => {
            section.classList.toggle("active", i === index);
            progressBar[i].classList.toggle("active", i === index);
            if (i < index) {
                progressBar[i].classList.add("completed");
            } else {
                progressBar[i].classList.remove("completed");
            }
        });

        formSections[index].querySelector("input, select").focus({ preventScroll: true });
        formSections[index].querySelector("input, select").scrollIntoView({ behavior: "smooth", block: "center" });

        const firstInput = formSections[index].querySelector("input, select, textarea");
        if (firstInput) {
            firstInput.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Make progress steps unclickable
    progressBar.forEach(step => {
        step.style.pointerEvents = "none";
    });

    document.getElementById("program").addEventListener("change", function () {
        if (this.value === "tesda-scholarship") {
            document.getElementById("scholarship-package").style.display = "block";
        } else {
            document.getElementById("scholarship-package").style.display = "none";
        }
    });

    document.querySelectorAll('input[name="scholarship"]').forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "OTHER") {
                document.getElementById("other-scholarship").style.display = "block";
            } else {
                document.getElementById("other-scholarship").style.display = "none";
            }
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.scrollTo({ top: 20, behavior: 'smooth' });
            generateSummaryContent();
            if (validateSection(currentSection)) {
                currentSection++;
                if (currentSection === formSections.length - 2) {
                    generateReviewContent();
                }
                showSection(currentSection);
            } else {
                highlightInvalidInputs();
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentSection--;
            showSection(currentSection);
        });
    });

    function validateSection(index) {
        const inputs = formSections[index].querySelectorAll("input[required], select[required]");
        let valid = true;

        inputs.forEach(input => {
            if (!input.checkValidity() || input.value === "") {
                valid = false;
                input.classList.add("invalid");
            } else {
                input.classList.remove("invalid");
            }
        });

        if (document.getElementById("program").value === "tesda-scholarship") {
            const scholarshipRadios = document.querySelectorAll('input[name="scholarship"]');
            const scholarshipSelected = Array.from(scholarshipRadios).some(radio => radio.checked);

            if (!scholarshipSelected) {
                valid = false;
                document.querySelectorAll('input[name="scholarship"]').forEach(radio => radio.classList.add("invalid"));
            } else {
                document.querySelectorAll('input[name="scholarship"]').forEach(radio => radio.classList.remove("invalid"));
            }
        }

        if (!valid) {
            const firstInvalidInput = formSections[index].querySelector(".invalid");
            firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
            firstInvalidInput.focus();
        }

        return valid;
    }

    function highlightInvalidInputs() {
        const inputs = formSections[currentSection].querySelectorAll("input[required], select[required]");
        inputs.forEach(input => {
            if (!input.checkValidity() || input.value === "") {
                input.classList.add("invalid");
            }
        });
    }

    function generateSummaryContent() {
        document.getElementById("review-program-1").textContent = document.getElementById("program").value.toUpperCase() || "";
        document.getElementById("review-branch-1").textContent = document.getElementById("branch").value.toUpperCase() || "";
        document.getElementById("review-course-1"). textContent = document.getElementById("course").value.toUpperCase() || "";

        document.getElementById("review-program-2").textContent = document.getElementById("program").value.toUpperCase() || "";
        document.getElementById("review-branch-2").textContent = document.getElementById("branch").value.toUpperCase() || "";
        document.getElementById("review-course-2").textContent = document.getElementById("course").value.toUpperCase() || "";
    }

    function generateReviewContent() {
        document.getElementById("review-program").textContent = document.getElementById("program").value.toUpperCase() || "";
        document.getElementById("review-branch").textContent = document.getElementById("branch").value.toUpperCase() || "";
        document.getElementById("review-course").textContent = document.getElementById("course").value.toUpperCase() || "";
        document.getElementById("review-scholarship").textContent = document.querySelector('input[name="scholarship"]:checked') ? document.querySelector('input[name="scholarship"]:checked').value.toUpperCase() : "NA";

        const fullName = `${document.getElementById("last-name").value.toUpperCase()}, ${document.getElementById("first-name").value.toUpperCase()} ${document.getElementById("middle-name").value.toUpperCase() || ""}`.trim();
        document.getElementById("review-full-name").textContent = fullName || "";

        document.getElementById("review-gender").textContent = document.getElementById("gender").value.toUpperCase() || "";
        document.getElementById("review-civil-status").textContent = document.getElementById("civil-status").value.toUpperCase() || "";
        document.getElementById("review-nationality").textContent = document.getElementById("nationality").value.toUpperCase() || "";
        document.getElementById("review-dob").textContent = document.getElementById("dob").value.toUpperCase() || "";
        document.getElementById("review-birthplace").textContent = document.getElementById("birthplace").value.toUpperCase() || "";
        document.getElementById("review-religion").textContent = document.getElementById("religion").value.toUpperCase() || "";
        document.getElementById("review-employment-status").textContent = document.getElementById("employment-status").value.toUpperCase() || "";
        document.getElementById("review-education-before").textContent = document.getElementById("education-before").value.toUpperCase() || "";

        document.getElementById("review-mobile").textContent = document.getElementById("mobile").value.toUpperCase() || "";
        document.getElementById("review-email").textContent = document.getElementById("email").value.toUpperCase() || "";
        document.getElementById("review-facebook").textContent = document.getElementById("facebook").value.toUpperCase() || "";

        document.getElementById("review-current-address").textContent = `${document.getElementById("current-unit").value.toUpperCase() || ""}, ${document.getElementById("current-street").value.toUpperCase() || ""}, ${document.getElementById("current-barangay").value.toUpperCase() || ""}, ${document.getElementById("current-city").value.toUpperCase() || ""} ${document.getElementById("current-province").value.toUpperCase() || ""} ${document.getElementById("current-zip").value.toUpperCase() || ""}`;

        document.getElementById("review-permanent-address").textContent = `${document.getElementById("permanent-unit").value.toUpperCase() || ""}, ${document.getElementById("permanent-street").value.toUpperCase() || ""}, ${document.getElementById("permanent-barangay").value.toUpperCase() || ""}, ${document.getElementById("permanent-city").value.toUpperCase() || ""} ${document.getElementById("permanent-province").value.toUpperCase() || ""} ${document.getElementById("permanent-zip").value.toUpperCase() || ""}`;

        const famFullName = `${document.getElementById("fam-last-name").value.toUpperCase()}, ${document.getElementById("fam-first-name").value.toUpperCase()} ${document.getElementById("fam-middle-name").value.toUpperCase() || ""}`.trim();
        document.getElementById("review-fam-full-name").textContent = famFullName || "";

        document.getElementById("review-fam-gender").textContent = document.getElementById("fam-gender").value.toUpperCase() || "";
        document.getElementById("review-fam-civil-status").textContent = document.getElementById("fam-civil-status").value.toUpperCase() || "";
        document.getElementById="review-fam-nationality").textContent = document.getElementById("fam-nationality").value.toUpperCase() || "";
        document.getElementById("review-fam-dob").textContent = document.getElementById("fam-dob").value.toUpperCase() || "";
        document.getElementById("review-fam-birthplace").textContent = document.getElementById("fam-birthplace").value.toUpperCase() || "";
        document.getElementById("review-fam-religion").textContent = document.getElementById("fam-religion").value.toUpperCase() || "";
        document.getElementById("review-fam-occupation").textContent = document.getElementById("fam-occupation").value.toUpperCase() || "";
        document.getElementById("review-fam-relationship").textContent = document.getElementById("fam-relationship").value.toUpperCase() || "";
        document.getElementById("review-fam-mobile").textContent = document.getElementById("fam-mobile").value.toUpperCase() || "";
        document.getElementById("review-fam-email").textContent = document.getElementById("fam-email").value.toUpperCase() || "";
        document.getElementById("review-fam-facebook").textContent = document.getElementById("fam-facebook").value.toUpperCase() || "";

        document.getElementById("review-fam-current-address").textContent = `${document.getElementById("fam-current-unit").value.toUpperCase() || ""}, ${document.getElementById("fam-current-street").value.toUpperCase() || ""}, ${document.getElementById("fam-current-barangay").value.toUpperCase() || ""}, ${document.getElementById("fam-current-city").value.toUpperCase() || ""} ${document.getElementById("fam-current-province").value.toUpperCase() || ""} ${document.getElementById("fam-current-zip").value.toUpperCase() || ""}`;

        document.getElementById("review-fam-permanent-address").textContent = `${document.getElementById("fam-permanent-unit").value.toUpperCase() || ""}, ${document.getElementById("fam-permanent-street").value.toUpperCase() || ""}, ${document.getElementById("fam-permanent-barangay").value.toUpperCase() || ""}, ${document.getElementById("fam-permanent-city").value.toUpperCase() || ""} ${document.getElementById("fam-permanent-province").value.toUpperCase() || ""} ${document.getElementById("fam-permanent-zip").value.toUpperCase() || ""}`;
    }

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (validateSection(currentSection)) {
            const formData = new FormData(document.getElementById("admissionForm")); // Ensure the correct form ID is used
            const jsonData = {};
            formData.forEach((value, key) => jsonData[key] = value);

            // Set the Google Apps Script URL
            const googleScriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your actual script ID

            fetch(googleScriptUrl, {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    alert("Form submitted successfully!");
                    // Hide current section and show finish section
                    formSections[currentSection].classList.remove("active");
                    document.getElementById("finish-section").classList.add("active");
                    // Update progress bar step 4 to completed
                    progressBar[3].classList.add("completed");
                    progressBar[3].innerHTML = '<img src="/AsiaSourceiCollege/src/imagesSource/check-step.png" class="step-img" alt="check">';
                    currentSection++;
                } else {
                    alert("There was an error submitting the form.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error submitting the form.");
            });
        } else {
            highlightInvalidInputs();
            alert("Please fill out all required fields.");
        }
    });

    document.getElementById("privacy-disclaimer").addEventListener("change", function () {
        document.getElementById("submit-btn").disabled = !this.checked;
    });

    document.getElementById("same-address").addEventListener("change", function () {
        if (this.checked) {
            document.getElementById("permanent-unit").value = document.getElementById("current-unit").value;
            document.getElementById("permanent-street").value = document.getElementById("current-street").value;
            document.getElementById("permanent-barangay").value = document.getElementById("current-barangay").value;
            document.getElementById("permanent-city").value = document.getElementById("current-city").value;
            document.getElementById("permanent-province").value = document.getElementById("current-province").value;
            document.getElementById("permanent-zip").value = document.getElementById("current-zip").value;
        } else {
            document.getElementById("permanent-unit").value = "";
            document.getElementById("permanent-street").value = "";
            document.getElementById("permanent-barangay").value = "";
            document.getElementById("permanent-city").value = "";
            document.getElementById("permanent-province").value = "";
            document.getElementById("permanent-zip").value = "";
        }
    });

    document.getElementById("fam-same-address").addEventListener("change", function () {
        if (this.checked) {
            document.getElementById("fam-permanent-unit").value = document.getElementById("fam-current-unit").value;
            document.getElementById("fam-permanent-street").value = document.getElementById("fam-current-street").value;
            document.getElementById("fam-permanent-barangay").value = document.getElementById("fam-current-barangay").value;
            document.getElementById("fam-permanent-city").value = document.getElementById("fam-current-city").value;
            document.getElementById("fam-permanent-province").value = document.getElementById("fam-current-province").value;
            document.getElementById("fam-permanent-zip").value = document.getElementById("fam-current-zip").value;
        } else {
            document.getElementById("fam-permanent-unit").value = "";
            document.getElementById="fam-permanent-street").value = "";
            document.getElementById("fam-permanent-barangay").value = "";
            document.getElementById("fam-permanent-city").value = "";
            document.getElementById("fam-permanent-province").value = "";
            document.getElementById("fam-permanent-zip").value = "";
        }
    });

    // FAQ toggle functionality
    const faqQuestions = document.querySelectorAll(".faq .question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle("active");
            question.classList.toggle("active");
        });
    });

    // Print functionality
    printButton.addEventListener("click", () => {
        generatePDF(true);
    });

    // Download PDF functionality
    downloadButton.addEventListener("click", () => {
        generatePDF(false);
    });

    function generatePDF(print = false) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add logo
        const logo = new Image();
        logo.src = './src/Asic-Image/Tesda.png'; // Update the path to your logo image
        logo.onload = function () {
            // Center the logo
            const imgProps = doc.getImageProperties(logo);
            const logoWidth = 50;
            const logoHeight = (imgProps.height / imgProps.width) * logoWidth;
            const centerX = (doc.internal pageSize.getWidth() - logoWidth) / 2;
            doc.addImage(logo, 'PNG', centerX, 10, logoWidth, logoHeight);

            // Add header
            doc.setFontSize(18);
            doc.text('Training & Assessment Application Summary', 105, 40, null, null, 'center');

            // Collect form data
            const formData = new FormData(document.getElementById("application-form"));
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Add user inputs to PDF
            let yPosition = 50;
            doc.setFontSize(12);

            // Basic Information
            yPosition += 10;
            doc.setFontSize(14);
            doc.text('Basic Information', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Program: ${data.program || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Preferred Branch: ${data.branch || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Course: ${data.course || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Scholarship Package: ${data.scholarship || ''}`, 20, yPosition);

            // Personal Information
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Personal Information', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Full Name: ${data['last-name']}, ${data['first-name']} ${data['middle-name'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Gender: ${data.gender || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Civil Status: ${data['civil-status'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Nationality: ${data.nationality || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Date of Birth: ${data.dob || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Birthplace: ${data.birthplace || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Religion: ${data.religion || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Employment Status: ${data['employment-status'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Educational Attainment: ${data['education-before'] || ''}`, 20, yPosition);

            // Contact Details
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Contact Details', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Mobile Number: ${data.mobile || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Email Address: ${data.email || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Facebook Account: ${data.facebook || ''}`, 20, yPosition);

            // Address
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Address', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Current Address: ${data['current-unit']}, ${data['current-street']}, ${data['current-barangay']}, ${data['current-city']}, ${data['current-province']} ${data['current-zip']}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Permanent Address: ${data['permanent-unit']}, ${data['permanent-street']}, ${data['permanent-barangay']}, ${data['permanent-city']}, ${data['permanent-province']} ${data['permanent-zip']}`, 20, yPosition);

            // Family Information
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Family Information', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Full Name: ${data['fam-last-name']}, ${data['fam-first-name']} ${data['fam-middle-name'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Gender: ${data['fam-gender'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Civil Status: ${data['fam-civil-status'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Nationality: ${data['fam-nationality'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Date of Birth: ${data['fam-dob'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Birthplace: ${data['fam-birthplace'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Religion: ${data['fam-religion'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Occupation: ${data['fam-occupation'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Relationship: ${data['fam-relationship'] || ''}`, 20, yPosition);

            // Family Contact Details
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Family Contact Details', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Mobile Number: ${data['fam-mobile'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Email Address: ${data['fam-email'] || ''}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Facebook Account: ${data['fam-facebook'] || ''}`, 20, yPosition);

            // Family Address
            yPosition += 15;
            doc.setFontSize(14);
            doc.text('Family Address', 20, yPosition);
            yPosition += 10;
            doc.setFontSize(12);
            doc.text(`Current Address: ${data['fam-current-unit']}, ${data['fam-current-street']}, ${data['fam-current-barangay']}, ${data['fam-current-city']}, ${data['fam-current-province']} ${data['fam-current-zip']}`, 20, yPosition);
            yPosition += 10;
            doc.text(`Permanent Address: ${data['fam-permanent-unit']}, ${data['fam-permanent-street']}, ${data['fam-permanent-barangay']}, ${data['fam-permanent-city']}, ${data['fam-permanent-province']} ${data['fam-permanent-zip']}`, 20, yPosition);

            if (print) {
                // Print the PDF
                doc.output('dataurlnewwindow');
            } else {
                // Save the PDF
                doc.save('form-summary.pdf');
            }
        };
    }

    showSection(currentSection);
});
