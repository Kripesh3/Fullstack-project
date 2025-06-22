<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\EventCategory;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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

        // Create organizer user
        $organizer = User::firstOrCreate(
            ['email' => 'organizer@eventease.com'],
            [
                'name' => 'Event Organizer',
                'role' => 'organizer',
                'password' => Hash::make('organizer123'),
                'email_verified_at' => now(),
            ]
        );

        // Create regular user
        $user = User::firstOrCreate(
            ['email' => 'user@eventease.com'],
            [
                'name' => 'Regular User',
                'role' => 'user',
                'password' => Hash::make('user123'),
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

        // Get the created categories
        $techCategory = EventCategory::where('name', 'Technology')->first();
        $businessCategory = EventCategory::where('name', 'Business')->first();
        $educationCategory = EventCategory::where('name', 'Education')->first();
        $entertainmentCategory = EventCategory::where('name', 'Entertainment')->first();
        $sportsCategory = EventCategory::where('name', 'Sports')->first();

        // Create sample events
        $events = [
            [
                'title' => 'Tech Conference 2024',
                'description' => 'Join us for the biggest tech conference of the year featuring the latest innovations in AI, blockchain, and web development.',
                'location' => 'San Francisco Convention Center',
                'date' => Carbon::now()->addDays(30)->format('Y-m-d'),
                'time' => '09:00:00',
                'ticket_price' => 299.99,
                'capacity' => 500,
                'image' => 'https://via.placeholder.com/800x400/4f46e5/ffffff?text=Tech+Conference+2024',
                'category_id' => $techCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
            [
                'title' => 'Business Leadership Summit',
                'description' => 'Learn from industry leaders and network with fellow entrepreneurs at this exclusive business summit.',
                'location' => 'New York Marriott Hotel',
                'date' => Carbon::now()->addDays(45)->format('Y-m-d'),
                'time' => '08:30:00',
                'ticket_price' => 199.99,
                'capacity' => 200,
                'image' => 'https://via.placeholder.com/800x400/059669/ffffff?text=Business+Summit',
                'category_id' => $businessCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
            [
                'title' => 'Web Development Workshop',
                'description' => 'Hands-on workshop covering React, Node.js, and modern web development practices. Perfect for beginners and intermediate developers.',
                'location' => 'Online Event',
                'date' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'time' => '14:00:00',
                'ticket_price' => 49.99,
                'capacity' => 100,
                'image' => 'https://via.placeholder.com/800x400/dc2626/ffffff?text=Web+Dev+Workshop',
                'category_id' => $educationCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
            [
                'title' => 'Music Festival 2024',
                'description' => 'Three days of amazing music featuring top artists from around the world. Food trucks, activities, and unforgettable experiences.',
                'location' => 'Central Park, New York',
                'date' => Carbon::now()->addDays(60)->format('Y-m-d'),
                'time' => '12:00:00',
                'ticket_price' => 149.99,
                'capacity' => 1000,
                'image' => 'https://via.placeholder.com/800x400/7c3aed/ffffff?text=Music+Festival',
                'category_id' => $entertainmentCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
            [
                'title' => 'Marathon Training Program',
                'description' => 'Join our 12-week marathon training program designed for runners of all levels. Expert coaching and nutrition guidance included.',
                'location' => 'City Running Track',
                'date' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'time' => '06:00:00',
                'ticket_price' => 79.99,
                'capacity' => 50,
                'image' => 'https://via.placeholder.com/800x400/ea580c/ffffff?text=Marathon+Training',
                'category_id' => $sportsCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
            [
                'title' => 'Free Community Coding Workshop',
                'description' => 'Learn the basics of programming in this free community workshop. No experience required!',
                'location' => 'Community Center',
                'date' => Carbon::now()->addDays(20)->format('Y-m-d'),
                'time' => '10:00:00',
                'ticket_price' => 0.00,
                'capacity' => 30,
                'image' => 'https://via.placeholder.com/800x400/0891b2/ffffff?text=Free+Coding+Workshop',
                'category_id' => $educationCategory->id,
                'organizer_id' => $organizer->id,
                'status' => 'approved',
            ],
        ];

        foreach ($events as $eventData) {
            Event::firstOrCreate(
                ['title' => $eventData['title']],
                $eventData
            );
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin: admin@eventease.com / admin123');
        $this->command->info('Organizer: organizer@eventease.com / organizer123');
        $this->command->info('User: user@eventease.com / user123');
        $this->command->info('Created ' . count($events) . ' sample events');
    }
}
