<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class BasicDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting basic data seeding...');

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@eventease.com'],
            [
                'name' => 'Admin User',
                'role' => 'admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // Create event categories
        $categories = [
            ['name' => 'Technology', 'description' => 'Tech conferences, workshops, and meetups'],
            ['name' => 'Business', 'description' => 'Business conferences and networking events'],
            ['name' => 'Education', 'description' => 'Educational workshops and seminars'],
            ['name' => 'Entertainment', 'description' => 'Concerts, shows, and entertainment events'],
            ['name' => 'Sports', 'description' => 'Sports events and competitions'],
            ['name' => 'Health', 'description' => 'Health and wellness events'],
        ];

        foreach ($categories as $categoryData) {
            EventCategory::firstOrCreate(
                ['name' => $categoryData['name']],
                $categoryData
            );
        }

        // Create organizers
        $organizers = [
            [
                'name' => 'Tech Conference Organizer',
                'email' => 'tech@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0101',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Music Events Manager',
                'email' => 'music@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0102',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Business Networking Pro',
                'email' => 'business@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0103',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($organizers as $organizer) {
            User::firstOrCreate(
                ['email' => $organizer['email']],
                $organizer
            );
        }

        // Create attendees
        $attendees = [
            [
                'name' => 'John Developer',
                'email' => 'john.dev@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0201',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sarah Marketing',
                'email' => 'sarah.marketing@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0202',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mike Student',
                'email' => 'mike.student@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0203',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($attendees as $attendee) {
            User::firstOrCreate(
                ['email' => $attendee['email']],
                $attendee
            );
        }

        $this->command->info('✅ Basic users and categories created!');
        $this->command->info('📊 Summary:');
        $this->command->info('   • Categories: ' . EventCategory::count());
        $this->command->info('   • Users: ' . User::count());
        $this->command->info('');
        $this->command->info('🔑 Login credentials:');
        $this->command->info('   • admin@eventease.com (password: admin123)');
        $this->command->info('   • tech@eventease.com (password: password123)');
        $this->command->info('   • music@eventease.com (password: password123)');
        $this->command->info('   • business@eventease.com (password: password123)');
        $this->command->info('   • john.dev@example.com (password: password123)');
        $this->command->info('   • sarah.marketing@example.com (password: password123)');
        $this->command->info('   • mike.student@example.com (password: password123)');
    }
}
