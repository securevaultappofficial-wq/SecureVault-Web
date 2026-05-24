<?php
/**
 * SecureVault v1 - System Health Check
 * Run this file to verify your setup
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureVault - System Health Check</title>
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
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(15, 52, 96, 0.8);
            border: 2px solid #00d4ff;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
        }
        h1 {
            color: #00d4ff;
            margin-bottom: 30px;
            text-align: center;
        }
        .check-item {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            border-left: 4px solid #00ff88;
        }
        .check-item.warning {
            border-left-color: #ffaa00;
        }
        .check-item.error {
            border-left-color: #ff4444;
        }
        .status {
            font-size: 24px;
            margin-right: 15px;
            min-width: 30px;
        }
        .status.success::before {
            content: '✓';
            color: #00ff88;
        }
        .status.warning::before {
            content: '⚠';
            color: #ffaa00;
        }
        .status.error::before {
            content: '✗';
            color: #ff4444;
        }
        .info {
            flex: 1;
        }
        .info-label {
            color: #00d4ff;
            font-weight: 600;
        }
        .info-value {
            color: #b0b0b0;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        .summary {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 10px;
            text-align: center;
        }
        .summary.ok {
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid #00ff88;
        }
        .summary.warning {
            background: rgba(255, 170, 0, 0.1);
            border: 2px solid #ffaa00;
        }
        .summary.error {
            background: rgba(255, 68, 68, 0.1);
            border: 2px solid #ff4444;
        }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        button {
            background: linear-gradient(135deg, #00d4ff, #00ff88);
            color: #000;
            border: none;
            padding: 12px 30px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 20px;
            width: 100%;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 SecureVault v1 - System Health Check</h1>

        <?php
        // Collect check results
        $checks = [];
        $overall_status = 'ok';

        // 1. PHP Version
        $php_version = phpversion();
        $checks[] = [
            'label' => 'PHP Version',
            'value' => $php_version,
            'status' => version_compare($php_version, '7.2.0', '>=') ? 'success' : 'warning',
            'message' => version_compare($php_version, '7.2.0', '>=') ? 'PHP 7.2+ required' : 'Consider updating to PHP 7.2+'
        ];

        // 2. File Permissions
        $files_to_check = [
            'index.html' => 'HTML Home',
            'styles.css' => 'CSS Styles',
            'script.js' => 'JavaScript',
            'send_email.php' => 'Email Handler',
            'config.php' => 'Configuration'
        ];

        $files_ok = true;
        foreach ($files_to_check as $file => $name) {
            if (!file_exists($file)) {
                $checks[] = [
                    'label' => "File: $name",
                    'value' => 'MISSING',
                    'status' => 'error',
                    'message' => "File $file not found!"
                ];
                $files_ok = false;
                $overall_status = 'error';
            } else {
                $checks[] = [
                    'label' => "File: $name",
                    'value' => 'Present',
                    'status' => 'success',
                    'message' => "✓ File exists"
                ];
            }
        }

        // 3. Mail Function
        $mail_enabled = function_exists('mail');
        $checks[] = [
            'label' => 'PHP mail() Function',
            'value' => $mail_enabled ? 'Enabled' : 'Disabled',
            'status' => $mail_enabled ? 'success' : 'warning',
            'message' => $mail_enabled ? '✓ Email sending available' : '⚠ Email may not work - configure SMTP'
        ];
        if (!$mail_enabled) $overall_status = $overall_status === 'ok' ? 'warning' : $overall_status;

        // 4. Write Permissions
        $write_test_file = 'test_write_' . time() . '.tmp';
        $write_enabled = false;
        if (@file_put_contents($write_test_file, 'test')) {
            $write_enabled = true;
            @unlink($write_test_file);
        }
        $checks[] = [
            'label' => 'Directory Write Permissions',
            'value' => $write_enabled ? 'Writable' : 'Read-only',
            'status' => $write_enabled ? 'success' : 'warning',
            'message' => $write_enabled ? '✓ Can write files' : '⚠ Cannot write - logging may fail'
        ];
        if (!$write_enabled) $overall_status = $overall_status === 'ok' ? 'warning' : $overall_status;

        // 5. Config File
        $config_exists = file_exists('config.php');
        $checks[] = [
            'label' => 'Configuration File',
            'value' => $config_exists ? 'Found' : 'Missing',
            'status' => $config_exists ? 'success' : 'warning',
            'message' => $config_exists ? '✓ Config available' : '⚠ Using defaults'
        ];

        // 6. Module Checks
        $modules = [
            'json' => 'JSON Extension',
            'gd' => 'Image Processing',
            'curl' => 'cURL (for external APIs)'
        ];

        foreach ($modules as $ext => $name) {
            $status = extension_loaded($ext);
            $checks[] = [
                'label' => "Module: $name",
                'value' => $status ? 'Loaded' : 'Not Loaded',
                'status' => $status ? 'success' : 'warning',
                'message' => $status ? '✓ Available' : '⚠ Optional'
            ];
        }

        // Display checks
        foreach ($checks as $check) {
            $status_class = $check['status'];
            echo '<div class="check-item ' . $status_class . '">';
            echo '  <div class="status ' . $status_class . '"></div>';
            echo '  <div class="info">';
            echo '    <div class="info-label">' . $check['label'] . '</div>';
            echo '    <div class="info-value">' . $check['value'] . ' • ' . $check['message'] . '</div>';
            echo '  </div>';
            echo '</div>';
        }
        ?>

        <div class="summary <?php echo $overall_status; ?>">
            <?php
            if ($overall_status === 'ok') {
                echo '<h2 style="color: #00ff88;">✓ All Systems Go!</h2>';
                echo '<p>Your SecureVault website is ready to launch.</p>';
            } elseif ($overall_status === 'warning') {
                echo '<h2 style="color: #ffaa00;">⚠ Some Warnings</h2>';
                echo '<p>Your site will work, but some features may be limited. Consider addressing the warnings above.</p>';
            } else {
                echo '<h2 style="color: #ff4444;">✗ Configuration Issues</h2>';
                echo '<p>Please fix the errors above before launching.</p>';
            }
            ?>
            <button onclick="location.href='index.html'">🚀 Go to Website</button>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 10px; font-size: 0.9rem;">
            <strong>Server Info:</strong><br>
            OS: <?php echo php_uname(); ?><br>
            Server Software: <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'; ?><br>
            Current Time: <?php echo date('Y-m-d H:i:s'); ?><br>
            <code>http://<?php echo $_SERVER['HTTP_HOST'] ?? 'localhost'; ?></code>
        </div>
    </div>
</body>
</html>
