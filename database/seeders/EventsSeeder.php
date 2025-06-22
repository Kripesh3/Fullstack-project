<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        // First create basic data if it doesn't exist
        $this->createBasicData();
        
        // Then create events
        $this->createEvents();
    }
    
    private function createBasicData()
    {
        // Create admin user
        User::firstOrCreate(
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
            ['name' => 'Tech Organizer', 'email' => 'tech@eventease.com', 'role' => 'organizer'],
            ['name' => 'Music Organizer', 'email' => 'music@eventease.com', 'role' => 'organizer'],
            ['name' => 'Business Organizer', 'email' => 'business@eventease.com', 'role' => 'organizer'],
        ];

        foreach ($organizers as $organizer) {
            User::firstOrCreate(
                ['email' => $organizer['email']],
                array_merge($organizer, [
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now()
                ])
            );
        }

        // Create attendees
        $attendees = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'role' => 'user'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'role' => 'user'],
            ['name' => 'Mike Johnson', 'email' => 'mike@example.com', 'role' => 'user'],
        ];

        foreach ($attendees as $attendee) {
            User::firstOrCreate(
                ['email' => $attendee['email']],
                array_merge($attendee, [
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now()
                ])
            );
        }
    }
    
    private function createEvents()
    {
        $techCategory = EventCategory::where('name', 'Technology')->first();
        $businessCategory = EventCategory::where('name', 'Business')->first();
        $entertainmentCategory = EventCategory::where('name', 'Entertainment')->first();
        $sportsCategory = EventCategory::where('name', 'Sports')->first();
        $educationCategory = EventCategory::where('name', 'Education')->first();
        $healthCategory = EventCategory::where('name', 'Health')->first();
        
        $techOrganizer = User::where('email', 'tech@eventease.com')->first();
        $musicOrganizer = User::where('email', 'music@eventease.com')->first();
        $businessOrganizer = User::where('email', 'business@eventease.com')->first();
        
        $attendees = User::where('role', 'user')->get();

        // Approved events
        $approvedEvents = [
            [
                'title' => 'AI & Machine Learning Summit 2025',
                'description' => 'Join industry leaders for a comprehensive exploration of AI and ML technologies.',
                'location' => 'San Francisco Convention Center, CA',
                'date' => Carbon::now()->addDays(15),
                'time' => '09:00:00',
                'capacity' => 500,
                'ticket_price' => 299.99,
                'status' => 'approved',
                'category_id' => $techCategory->id,
                'organizer_id' => $techOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Summer Music Festival 2025',
                'description' => 'Three days of incredible live music featuring local and international artists.',
                'location' => 'Golden Gate Park, San Francisco, CA',
                'date' => Carbon::now()->addDays(60),
                'time' => '14:00:00',
                'capacity' => 2000,
                'ticket_price' => 125.00,
                'status' => 'approved',
                'category_id' => $entertainmentCategory->id,
                'organizer_id' => $musicOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Entrepreneurship & Startup Expo',
                'description' => 'Connect with investors, mentors, and fellow entrepreneurs.',
                'location' => 'Chicago Business District, IL',
                'date' => Carbon::now()->addDays(18),
                'time' => '08:30:00',
                'capacity' => 400,
                'ticket_price' => 179.99,
                'status' => 'approved',
                'category_id' => $businessCategory->id,
                'organizer_id' => $businessOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Community 5K Fun Run',
                'description' => 'Join hundreds of runners for our annual community 5K fun run.',
                'location' => 'Central Park, New York, NY',
                'date' => Carbon::now()->addDays(20),
                'time' => '08:00:00',
                'capacity' => 800,
                'ticket_price' => 25.00,
                'status' => 'approved',
                'category_id' => $sportsCategory->id,
                'organizer_id' => $techOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1544531585-81c0e8b8c0b3?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Jazz Night at the Blue Note',
                'description' => 'An intimate evening of smooth jazz featuring renowned musicians.',
                'location' => 'Blue Note Jazz Club, Nashville, TN',
                'date' => Carbon::now()->addDays(12),
                'time' => '20:00:00',
                'capacity' => 120,
                'ticket_price' => 45.00,
                'status' => 'approved',
                'category_id' => $entertainmentCategory->id,
                'organizer_id' => $musicOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format'
            ]
        ];

        // Pending events
        $pendingEvents = [
            [
                'title' => 'Blockchain & Cryptocurrency Conference',
                'description' => 'Explore the future of finance and technology with blockchain experts.',
                'location' => 'Miami Beach Convention Center, FL',
                'date' => Carbon::now()->addDays(45),
                'time' => '09:30:00',
                'capacity' => 300,
                'ticket_price' => 249.99,
                'status' => 'pending',
                'category_id' => $techCategory->id,
                'organizer_id' => $techOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Underground DJ Battle',
                'description' => 'Electronic music event featuring upcoming DJs and producers.',
                'location' => 'Warehouse District, Detroit, MI',
                'date' => Carbon::now()->addDays(30),
                'time' => '22:00:00',
                'capacity' => 300,
                'ticket_price' => 25.00,
                'status' => 'pending',
                'category_id' => $entertainmentCategory->id,
                'organizer_id' => $musicOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Online Learning Platform Demo',
                'description' => 'Demonstration of new educational technology platform.',
                'location' => 'Virtual Event',
                'date' => Carbon::now()->addDays(14),
                'time' => '15:00:00',
                'capacity' => 1000,
                'ticket_price' => 0.00,
                'status' => 'pending',
                'category_id' => $educationCategory->id,
                'organizer_id' => $businessOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&auto=format'
            ]
        ];

        // Rejected events
        $rejectedEvents = [
            [
                'title' => 'Questionable Investment Seminar',
                'description' => 'Learn about high-risk investment strategies.',
                'location' => 'Unknown Location',
                'date' => Carbon::now()->addDays(10),
                'time' => '19:00:00',
                'capacity' => 50,
                'ticket_price' => 500.00,
                'status' => 'rejected',
                'category_id' => $businessCategory->id,
                'organizer_id' => $businessOrganizer->id,
                'image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format'
            ]
        ];

        // Create all events
        $allEvents = array_merge($approvedEvents, $pendingEvents, $rejectedEvents);
        
        foreach ($allEvents as $eventData) {
            $event = Event::firstOrCreate(
                ['title' => $eventData['title']],
                $eventData
            );
            
            // Add random attendees to approved events
            if ($event->status === 'approved' && $attendees->count() > 0) {
                $randomAttendees = $attendees->random(min(3, $attendees->count()));
                foreach ($randomAttendees as $attendee) {
                    $event->attendees()->syncWithoutDetaching([$attendee->id]);
                }
            }
        }

        $this->command->info('✅ Events seeder completed successfully!');
        $this->command->info('📊 Created events with different statuses:');
        $this->command->info('   • Approved: ' . Event::where('status', 'approved')->count());
        $this->command->info('   • Pending: ' . Event::where('status', 'pending')->count());
        $this->command->info('   • Rejected: ' . Event::where('status', 'rejected')->count());
        $this->command->info('   • Total events: ' . Event::count());
        $this->command->info('');
        $this->command->info('🔑 Login credentials (password: password123 or admin123):');
        $this->command->info('   • admin@eventease.com (admin)');
        $this->command->info('   • tech@eventease.com (organizer)');
        $this->command->info('   • music@eventease.com (organizer)');
        $this->command->info('   • business@eventease.com (organizer)');
        $this->command->info('   • john@example.com (user)');
        $this->command->info('   • jane@example.com (user)');
        $this->command->info('   • mike@example.com (user)');
    }
}
