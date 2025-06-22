<?php

use App\Models\User;

$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@eventease.com', 
    'password' => bcrypt('admin123'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);

echo "Admin user created successfully!\n";
echo "Email: admin@eventease.com\n";
echo "Password: admin123\n";
