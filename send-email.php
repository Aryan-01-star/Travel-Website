<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Create email headers
    $to = "your-email@example.com"; // Replace with your email address
    $subject = "Feedback from TRIP-STAR";
    $headers = "From: $email" . "\r\n" .
        "Reply-To: $email" . "\r\n" .
        "X-Mailer: PHP/" . phpversion();

    // Compose the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message";

    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        // Email sent successfully
        echo "Thank you for your feedback!";
    } else {
        // Failed to send email
        echo "Sorry, something went wrong. Please try again later.";
    }
}
?>
