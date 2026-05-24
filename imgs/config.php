<?php
/**
 * SecureVault v1 - Configuration File
 * Central configuration for the website
 *
 * Edit this file to customize your website without modifying other files
 */

return [
    // Email Configuration
    'email' => [
        'recipient' => 'securevaultappofficial@gmail.com',
        'from_name' => 'SecureVault v1 Bug Report System',
        'subject_prefix' => '[SecureVault Bug Report]'
    ],

    // Website Information
    'website' => [
        'name' => 'SecureVault v1',
        'tagline' => 'AI-Powered Security Adviser',
        'description' => 'SecureVault v1 is an Android security app designed to help users scan, clean, and improve their digital safety.',
        'url' => 'https://your-domain.com', // Update with your domain
        'year_founded' => 2026,
        'status' => 'Under Development & Testing'
    ],

    // App Information
    'app' => [
        'name' => 'SecureVault v1',
        'version' => '1.0.0',
        'status' => 'BETA',
        'platform' => 'Android',
        'min_android' => '8.0',
        'max_android' => 'Latest',
        'apk_download_url' => 'securevault-v1-beta.apk'
    ],

    // Developer Information
    'developer' => [
        'name' => 'Saathvik Bonakurthi',
        'age' => '17 years old',
        'title' => 'Founder & Lead Developer',
        'school' => 'Swaminarayan Gurukul',
        'location' => 'Hyderabad',
        'class' => '12 MPC',
        'bio' => 'Passionate about cybersecurity and creating solutions that make digital safety understandable for everyone.',
        'passion' => 'Making complex security concepts simple and accessible'
    ],

    // Features
    'features' => [
        'smart_scan' => [
            'enabled' => true,
            'title' => 'Smart Scan',
            'description' => 'Checks multiple areas of your device in one quick scan'
        ],
        'malware_scan' => [
            'enabled' => true,
            'title' => 'Malware Scan',
            'description' => 'Focuses on suspicious files and risky APKs'
        ],
        'junk_cleaner' => [
            'enabled' => true,
            'title' => 'Junk Cleaner',
            'description' => 'Clean unnecessary files and free up storage space'
        ],
        'ai_adviser' => [
            'enabled' => true,
            'title' => 'AI Security Adviser',
            'description' => 'Get AI-powered explanations and guidance'
        ],
        'link_protection' => [
            'enabled' => true,
            'title' => 'Link Protection',
            'description' => 'Identify suspicious or phishing links'
        ],
        'advanced_reports' => [
            'enabled' => true,
            'title' => 'Advanced Reports',
            'description' => 'Detailed scan reports with history tracking'
        ]
    ],

    // Security Settings
    'security' => [
        'enable_honeypot' => true,
        'rate_limit_enabled' => true,
        'max_submissions_per_hour' => 10,
        'allowed_file_extensions' => ['txt', 'log', 'jpg', 'png'],
        'max_file_size' => 5242880, // 5MB
        'sanitize_input' => true,
        'validate_email' => true
    ],

    // Logging
    'logging' => [
        'enabled' => true,
        'log_file' => dirname(__FILE__) . '/bug_reports.log',
        'log_level' => 'info' // debug, info, warning, error
    ],

    // Email Templates
    'email_templates' => [
        'success_subject' => 'SecureVault Bug Report Received',
        'success_body' => 'Thank you for reporting this bug. We appreciate your help in improving SecureVault v1.',
        'error_subject' => 'Error Submitting Bug Report',
        'error_body' => 'We encountered an error while processing your report. Please try again later.'
    ],

    // Colors & Branding
    'branding' => [
        'primary_color' => '#1a1a2e',
        'accent_color' => '#00d4ff',
        'success_color' => '#00ff88',
        'warning_color' => '#ffaa00',
        'danger_color' => '#ff4444',
        'logo_file' => 'appicon.png',
        'favicon_file' => 'appicon.ico'
    ],

    // Navigation
    'navigation' => [
        'show_blog' => false,
        'show_forum' => false,
        'show_news' => false,
        'show_api_docs' => false
    ],

    // Analytics (optional)
    'analytics' => [
        'google_analytics_id' => '', // UA-XXXXXXXXX-X
        'track_events' => true,
        'track_downloads' => true
    ],

    // Social Media (optional)
    'social' => [
        'twitter' => '',
        'facebook' => '',
        'instagram' => '',
        'youtube' => '',
        'linkedin' => ''
    ],

    // Legal & Compliance
    'legal' => [
        'privacy_policy_url' => '#',
        'terms_conditions_url' => '#',
        'cookie_consent_enabled' => false,
        'gdpr_compliant' => true
    ],

    // API Configuration
    'api' => [
        'enable_api' => false,
        'api_version' => '1.0',
        'rate_limit' => 100,
        'allow_cors' => false
    ],

    // Performance
    'performance' => [
        'enable_minification' => true,
        'enable_compression' => true,
        'cache_expiry' => 3600,
        'lazy_load_images' => true,
        'lazy_load_videos' => true
    ],

    // Maintenance
    'maintenance' => [
        'enabled' => false,
        'message' => 'SecureVault website is under maintenance. Please check back soon!'
    ]
];
