<?php
/**
 * SecureVault v1 - Email Configuration Tester
 * Use this to verify your email settings are working
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureVault - Email Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
            color: #ffffff;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(15, 52, 96, 0.9);
            border: 2px solid #00d4ff;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
        }
        h1 {
            color: #00d4ff;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            color: #b0b0b0;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            color: #00d4ff;
            font-weight: 600;
            margin-bottom: 8px;
        }
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid #2a2a3e;
            border-radius: 8px;
            color: #ffffff;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus {
            outline: none;
            border-color: #00d4ff;
            background: rgba(0, 212, 255, 0.1);
        }
        button {
            background: linear-gradient(135deg, #00d4ff, #00ff88);
            color: #000;
            border: none;
            padding: 12px 30px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 10px;
            display: none;
        }
        .result.success {
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid #00ff88;
            color: #00ff88;
        }
        .result.error {
            background: rgba(255, 68, 68, 0.1);
            border: 2px solid #ff4444;
            color: #ff4444;
        }
        .info {
            background: rgba(0, 212, 255, 0.1);
            border-left: 4px solid #00d4ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 SecureVault Email Test</h1>
        <p class="subtitle">Verify your email configuration</p>

        <div class="info">
            <strong>⚠️ Important:</strong> This tool sends a test email to verify your SMTP configuration is working correctly. Check your inbox (and spam folder) for the test email.
        </div>

        <form id="emailForm">
            <div class="form-group">
                <label for="testEmail">Your Email Address *</label>
                <input type="email" id="testEmail" name="email" required placeholder="your-email@example.com">
            </div>

            <div class="form-group">
                <label for="yourName">Your Name *</label>
                <input type="text" id="yourName" name="name" required placeholder="Your Full Name">
            </div>

            <div class="form-group">
                <label for="testMessage">Test Message *</label>
                <textarea id="testMessage" name="message" required rows="4" placeholder="Type a test message...">This is a test email from SecureVault email configuration tester.</textarea>
            </div>

            <button type="submit">Send Test Email</button>
        </form>

        <div id="result" class="result"></div>
    </div>

    <script>
        document.getElementById('emailForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const testEmail = document.getElementById('testEmail').value;
            const yourName = document.getElementById('yourName').value;
            const testMessage = document.getElementById('testMessage').value;
            const resultDiv = document.getElementById('result');
            const button = document.querySelector('button');

            // Disable button and show loading
            button.disabled = true;
            button.textContent = 'Sending...';

            try {
                const response = await fetch('send_test_email.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: testEmail,
                        name: yourName,
                        message: testMessage
                    })
                });

                const data = await response.json();

                if (data.success) {
                    resultDiv.className = 'result success';
                    resultDiv.innerHTML = '✓ <strong>Test email sent successfully!</strong><br>Check your inbox (and spam folder) for the email.';
                    resultDiv.style.display = 'block';
                    document.getElementById('emailForm').reset();
                } else {
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = '✗ <strong>Failed to send email:</strong><br>' + (data.message || 'Unknown error');
                    resultDiv.style.display = 'block';
                }
            } catch (error) {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = '✗ <strong>Error:</strong><br>' + error.message;
                resultDiv.style.display = 'block';
            } finally {
                button.disabled = false;
                button.textContent = 'Send Test Email';
            }
        });
    </script>
</body>
</html>
