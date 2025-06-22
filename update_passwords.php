<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Updating passwords to 'password' for easier testing...\n";

$users = [
    'john@example.com',
    'jane@example.com', 
    'tech@eventease.com',
    'music@eventease.com',
    'business@eventease.com'
];

foreach ($users as $email) {
    $user = User::where('email', $email)->first();
    if ($user) {
        $user->password = Hash::make('password');
        $user->save();
        echo "✓ Updated password for: {$email}\n";
    } else {
        echo "✗ User not found: {$email}\n";
    }
}

echo "\nPassword update complete!\n";
echo "\nYou can now login with:\n";
echo "- Password: 'password' (for the updated accounts above)\n";
echo "- Password: 'password123' (for admin@eventease.com and other accounts)\n";
