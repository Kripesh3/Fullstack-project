<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test user with known credentials';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Create or update test user
        $user = User::updateOrCreate(
            ['email' => 'test@eventease.com'],
            [
                'name' => 'Test User',
                'email' => 'test@eventease.com',
                'password' => Hash::make('password123'),
                'role' => 'organizer',
                'email_verified_at' => now()
            ]
        );

        $this->info('Test user created/updated:');
        $this->info('Email: test@eventease.com');
        $this->info('Password: password123');
        $this->info('Role: organizer');
        $this->info('User ID: ' . $user->id);

        return 0;
    }
}
