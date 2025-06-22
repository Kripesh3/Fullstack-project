<?php

require_once 'vendor/autoload.php';

// Load .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Test Cloudinary configuration
echo "CLOUDINARY_CLOUD_NAME: " . $_ENV['CLOUDINARY_CLOUD_NAME'] . "\n";
echo "CLOUDINARY_API_KEY: " . (isset($_ENV['CLOUDINARY_API_KEY']) ? 'SET' : 'NOT SET') . "\n";
echo "CLOUDINARY_API_SECRET: " . (isset($_ENV['CLOUDINARY_API_SECRET']) ? 'SET' : 'NOT SET') . "\n";
echo "CLOUDINARY_URL: " . (isset($_ENV['CLOUDINARY_URL']) ? 'SET' : 'NOT SET') . "\n";

// Test Cloudinary SDK
try {
    $cloudinary = new \Cloudinary\Cloudinary([
        'cloud' => [
            'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
            'api_key' => $_ENV['CLOUDINARY_API_KEY'],
            'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
        ],
    ]);
    
    echo "Cloudinary SDK initialized successfully\n";
    
    // Test ping
    $result = $cloudinary->adminApi()->ping();
    echo "Cloudinary ping result: " . json_encode($result) . "\n";
    
} catch (Exception $e) {
    echo "Cloudinary SDK error: " . $e->getMessage() . "\n";
}
