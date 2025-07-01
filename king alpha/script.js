document.addEventListener('DOMContentLoaded', () => {
    // --- Responsive Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body; // Reference to the body element

    // Check if the toggle button and navigation exist before adding listeners
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle between fa-bars and fa-times for the icon
            const icon = menuToggle.querySelector('i');
            if (icon) { // Ensure icon exists
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            body.classList.toggle('no-scroll');
        });

        // Close nav when a link is clicked (for single-page navigation)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) { // Only close if nav is open
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- Function to check if an element is in the viewport (for scroll animations) ---
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const offset = 50; // Pixels from top/bottom to trigger animation
        return (
            rect.top < (window.innerHeight - offset) &&
            rect.bottom > offset &&
            rect.left < (window.innerWidth - offset) &&
            rect.right > offset
        );
    }

    // --- Function to handle adding 'active' class for fade-in/slide-in animations ---
    function handleScrollAnimation() {
        const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
        animatedElements.forEach(el => {
            if (isInViewport(el)) {
                el.classList.add('active');
            }
        });
    }

    // --- Event Listeners for Animations ---
    // Run once on load to catch elements already in view
    handleScrollAnimation();
    // Run on scroll and resize
    window.addEventListener('scroll', handleScrollAnimation);
    window.addEventListener('resize', handleScrollAnimation);

    // --- Smooth Scrolling for Navigation Links (specifically for same-page anchors) ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link points to an ID on the *current* page
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault(); // Prevent default hash jump
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Pre-fill Contact Form Subject based on URL parameters ---
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryType = urlParams.get('inquiry');

    if (inquiryType) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            // Check if the option actually exists before setting it
            const optionExists = Array.from(subjectSelect.options).some(option => option.value === inquiryType);
            if (optionExists) {
                subjectSelect.value = inquiryType;
            } else {
                subjectSelect.value = 'General Inquiry'; // Default if not a valid option
            }
        }
    }

    // --- WhatsApp Form Submission Logic ---
    const whatsappForm = document.getElementById('whatsappContactForm');
    const whatsappSuccessMessage = document.getElementById('whatsappSuccessMessage'); // Assuming you have this div
    const copyMessageBtn = document.getElementById('copyMessageBtn'); // Assuming you have this button

    // Your WhatsApp number in international format (e.g., 233 for Ghana, no leading 0)
    // You provided 0545983544, so for Ghana (+233), it becomes 233545983544
    const whatsappNumber = '233545983544';

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value; // Phone is optional in your form
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic validation: ensure essential fields are not empty
            if (!name || !email || !message) {
                alert('Please fill in your Name, Email, and Message.');
                return; // Stop the function if validation fails
            }

            // Construct the message for WhatsApp
            let whatsappMessage = `Hello Alpha Abacus Team,\n\n`;
            whatsappMessage += `I have an inquiry from your website.\n\n`;
            whatsappMessage += `Name: ${name}\n`;
            whatsappMessage += `Email: ${email}\n`;
            if (phone) { // Only add phone if provided
                whatsappMessage += `Phone: ${phone}\n`;
            }
            whatsappMessage += `Subject: ${subject}\n\n`;
            whatsappMessage += `Message:\n${message}\n\n`;
            whatsappMessage += `Thank you!`;

            // URL-encode the message to ensure it's correctly formatted for the URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Construct the WhatsApp API URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab/window
            // This is the core functionality you requested.
            window.open(whatsappUrl, '_blank');

            // --- Post-submission actions (optional but good for UX) ---
            if (whatsappSuccessMessage) {
                whatsappSuccessMessage.style.display = 'block';
                // Scroll to the success message (fixed typo here)
                whatsappSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Store the message content for the copy button
            if (copyMessageBtn) {
                copyMessageBtn.dataset.message = whatsappMessage;
            }

            // Clear the form (optional, but good for user experience)
            whatsappForm.reset();
        });

        // Copy message button functionality
        if (copyMessageBtn) {
            copyMessageBtn.addEventListener('click', () => {
                const messageToCopy = copyMessageBtn.dataset.message || ''; // Get the last message that was prepared
                if (messageToCopy) {
                    navigator.clipboard.writeText(messageToCopy).then(() => {
                        alert('Message copied to clipboard! You can now paste it directly into WhatsApp.');
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                        alert('Failed to copy message. Please manually copy the text from the WhatsApp window, or try again.');
                    });
                } else {
                    alert('No message to copy yet. Please fill out the form and click "Send Message" first.');
                }
            });
        }
    }
});