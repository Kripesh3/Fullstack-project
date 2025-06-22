<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create organizer user
$organizer = User::firstOrCreate(
    ['email' => 'organizer@eventease.com'],
    [
        'name' => 'Event Organizer',
        'role' => 'organizer',
        'password' => Hash::make('password123')
    ]
);

echo "Organizer user: " . $organizer->email . " (password: password123)\n";

// Create attendee user (using 'user' role)
$attendee = User::firstOrCreate(
    ['email' => 'attendee@eventease.com'],
    [
        'name' => 'John Attendee',
        'role' => 'user',
        'password' => Hash::make('password123')
    ]
);

echo "Attendee user: " . $attendee->email . " (password: password123)\n";

// Show all users
echo "\nAll users in database:\n";
foreach (User::all(['name', 'email', 'role']) as $user) {
    echo "- {$user->name} ({$user->email}) - Role: {$user->role}\n";
}
