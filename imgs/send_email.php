<?php
/**
 * SecureVault Bug Report Email Handler
 * Receives bug reports from the website form and sends them to the developer's email
 */

// Set response header as JSON
header('Content-Type: application/json');

// Enable error logging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define the email address to receive bug reports
$recipient_email = 'securevaultappofficial@gmail.com';
$website_name = 'SecureVault v1';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate that we received JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$required_fields = ['name', 'email', 'device', 'android', 'type', 'feature', 'severity', 'description', 'consent'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields: ' . implode(', ', $missing_fields)]);
    exit;
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Validate consent
if ($data['consent'] !== true) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'You must consent to share this report']);
    exit;
}

// Sanitize and prepare email content
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$device = htmlspecialchars($data['device'], ENT_QUOTES, 'UTF-8');
$android = htmlspecialchars($data['android'], ENT_QUOTES, 'UTF-8');
$type = htmlspecialchars($data['type'], ENT_QUOTES, 'UTF-8');
$feature = htmlspecialchars($data['feature'], ENT_QUOTES, 'UTF-8');
$severity = htmlspecialchars($data['severity'], ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars($data['description'], ENT_QUOTES, 'UTF-8');
$steps = htmlspecialchars($data['steps'] ?? '', ENT_QUOTES, 'UTF-8');
$expected = htmlspecialchars($data['expected'] ?? '', ENT_QUOTES, 'UTF-8');
$actual = htmlspecialchars($data['actual'] ?? '', ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'] ?? '', ENT_QUOTES, 'UTF-8');
$timestamp = date('Y-m-d H:i:s');

// Create email subject
$subject = "[{$type}] {$feature} - {$severity} Severity - {$website_name}";

// Create email body
$email_body = "
=============================================================================
                    {$website_name} BUG REPORT
=============================================================================

REPORT DETAILS:
---------------
Timestamp: {$timestamp}
Report ID: " . substr(hash('sha256', $timestamp . $email), 0, 12) . "

REPORTER INFORMATION:
---------------------
Name: {$name}
Email: {$email}

DEVICE INFORMATION:
-------------------
Device Model: {$device}
Android Version: {$android}

ISSUE CLASSIFICATION:
---------------------
Report Type: {$type}
Feature/Area Affected: {$feature}
Severity Level: {$severity}

ISSUE DESCRIPTION:
------------------
{$description}

STEPS TO REPRODUCE:
-------------------
" . (!empty($steps) ? $steps : 'Not provided') . "

EXPECTED BEHAVIOR:
------------------
" . (!empty($expected) ? $expected : 'Not provided') . "

ACTUAL BEHAVIOR:
----------------
" . (!empty($actual) ? $actual : 'Not provided') . "

ADDITIONAL COMMENTS:
--------------------
" . (!empty($message) ? $message : 'None') . "

=============================================================================

SEVERITY REFERENCE:
- Low: Minor issue, doesn't significantly affect functionality
- Medium: Affects functionality but has workarounds
- High: Major functionality is broken
- Critical: App crashes or completely unusable

This report was submitted through the SecureVault v1 website bug report form.
User has consented to share this information for app improvement purposes.

=============================================================================
";

// Create HTML email body (optional, for better formatting)
$html_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00d4ff, #00ff88); color: #000; padding: 20px; border-radius: 5px; text-align: center; }
        .section { margin: 20px 0; border-left: 4px solid #00d4ff; padding-left: 15px; }
        .section-title { font-weight: bold; color: #00d4ff; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
        .field { margin: 10px 0; }
        .field-label { font-weight: bold; color: #0f3460; }
        .field-value { color: #555; margin-left: 10px; word-wrap: break-word; }
        .severity { padding: 10px; border-radius: 5px; display: inline-block; }
        .severity-low { background: #e8f5e9; color: #2e7d32; }
        .severity-medium { background: #fff3e0; color: #e65100; }
        .severity-high { background: #ffebee; color: #c62828; }
        .severity-critical { background: #ffcdd2; color: #b71c1c; font-weight: bold; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🔒 SecureVault v1 Bug Report</h1>
        </div>

        <div class='section'>
            <div class='section-title'>Report Details</div>
            <div class='field'>
                <span class='field-label'>Timestamp:</span>
                <span class='field-value'>{$timestamp}</span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Reporter Information</div>
            <div class='field'>
                <span class='field-label'>Name:</span>
                <span class='field-value'>{$name}</span>
            </div>
            <div class='field'>
                <span class='field-label'>Email:</span>
                <span class='field-value'>{$email}</span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Device Information</div>
            <div class='field'>
                <span class='field-label'>Device Model:</span>
                <span class='field-value'>{$device}</span>
            </div>
            <div class='field'>
                <span class='field-label'>Android Version:</span>
                <span class='field-value'>{$android}</span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Issue Classification</div>
            <div class='field'>
                <span class='field-label'>Report Type:</span>
                <span class='field-value'>{$type}</span>
            </div>
            <div class='field'>
                <span class='field-label'>Feature/Area Affected:</span>
                <span class='field-value'>{$feature}</span>
            </div>
            <div class='field'>
                <span class='field-label'>Severity Level:</span>
                <span class='field-value'>
                    <span class='severity severity-" . strtolower($severity) . "'>{$severity}</span>
                </span>
            </div>
        </div>

        <div class='section'>
            <div class='section-title'>Issue Description</div>
            <div class='field-value'>" . nl2br($description) . "</div>
        </div>

        " . (!empty($steps) ? "
        <div class='section'>
            <div class='section-title'>Steps to Reproduce</div>
            <div class='field-value'>" . nl2br($steps) . "</div>
        </div>
        " : "") . "

        " . (!empty($expected) ? "
        <div class='section'>
            <div class='section-title'>Expected Behavior</div>
            <div class='field-value'>" . nl2br($expected) . "</div>
        </div>
        " : "") . "

        " . (!empty($actual) ? "
        <div class='section'>
            <div class='section-title'>Actual Behavior</div>
            <div class='field-value'>" . nl2br($actual) . "</div>
        </div>
        " : "") . "

        " . (!empty($message) ? "
        <div class='section'>
            <div class='section-title'>Additional Comments</div>
            <div class='field-value'>" . nl2br($message) . "</div>
        </div>
        " : "") . "

        <div class='footer'>
            <p>This report was submitted through the SecureVault v1 website bug report form.</p>
            <p>User has consented to share this information for app improvement purposes.</p>
        </div>
    </div>
</body>
</html>
";

// Set up email headers
$headers = array(
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'SecureVault v1 Bug Reporter',
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=utf-8'
);

$header_string = '';
foreach ($headers as $name => $value) {
    $header_string .= "{$name}: {$value}\r\n";
}

// Attempt to send email
$mail_sent = mail($recipient_email, $subject, $html_body, $header_string);

// Log the report (optional)
$log_file = dirname(__FILE__) . '/bug_reports.log';
$log_entry = date('Y-m-d H:i:s') . " | {$type} | {$feature} | {$severity} | {$name} ({$email})\n";

if (file_exists($log_file) && is_writable($log_file)) {
    file_put_contents($log_file, $log_entry, FILE_APPEND);
} else if (!file_exists($log_file)) {
    @file_put_contents($log_file, $log_entry);
}

// Send response
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Bug report submitted successfully! Thank you for helping improve SecureVault.',
        'report_time' => $timestamp
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please contact us directly at securevaultappofficial@gmail.com'
    ]);
}

exit;
?>
