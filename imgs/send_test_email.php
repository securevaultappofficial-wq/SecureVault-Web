<?php
/**
 * Send Test Email Handler
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Validate fields
if (empty($data['email']) || empty($data['name']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Sanitize data
$to_email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$timestamp = date('Y-m-d H:i:s');

// Prepare email
$subject = "[TEST] SecureVault Email Configuration Test";

$html_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00d4ff, #00ff88); color: #000; padding: 20px; border-radius: 5px; text-align: center; }
        .content { margin: 20px 0; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>✓ SecureVault Email Configuration Test</h1>
        </div>

        <div class='content'>
            <p>Hello <strong>{$name}</strong>,</p>
            <p>This is a test email from SecureVault email configuration tester.</p>
            <p><strong>Your Message:</strong></p>
            <blockquote style='background: #f5f5f5; padding: 15px; border-left: 4px solid #00d4ff;'>
                " . nl2br($message) . "
            </blockquote>
            <p>If you received this email, your mail configuration is working correctly!</p>
        </div>

        <div class='footer'>
            <p>Sent: {$timestamp}</p>
            <p>This is a test email from SecureVault v1 Email Tester</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = array(
    'From' => 'noreply@securevault.test',
    'Reply-To' => $to_email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=utf-8'
);

$header_string = '';
foreach ($headers as $name => $value) {
    $header_string .= "{$name}: {$value}\r\n";
}

// Send email
$mail_sent = mail($to_email, $subject, $html_body, $header_string);

// Response
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Test email sent successfully to ' . $to_email
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. PHP mail() function may not be configured.'
    ]);
}

exit;
?>
