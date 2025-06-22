<?php
// Test email script for XAMPP
require 'vendor/autoload.php';

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;

// Load Laravel app
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Mail::raw('Test email from EventEase XAMPP setup', function ($message) {
        $message->to('test@example.com')
                ->subject('EventEase Test Email');
    });
    echo "✅ Email sent successfully!\n";
} catch (Exception $e) {
    echo "❌ Email failed: " . $e->getMessage() . "\n";
}
