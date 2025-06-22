<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MoreEventsSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing data
        $categories = EventCategory::all();
        $organizers = User::where('role', 'organizer')->get();
        $users = User::where('role', 'user')->get();
        
        if ($organizers->isEmpty() || $categories->isEmpty()) {
            $this->command->error('Please run EventsSeeder first to create basic data');
            return;
        }

        // Additional comprehensive events
        $additionalEvents = [
            // More Technology Events
            [
                'title' => 'Web Development Bootcamp',
                'description' => 'Intensive 2-day workshop covering modern web development technologies including React, Node.js, and MongoDB. Perfect for developers looking to upgrade their skills.',
                'location' => 'Tech Hub, Austin, TX',
                'date' => Carbon::now()->addDays(22),
                'time' => '10:00:00',
                'capacity' => 80,
                'ticket_price' => 149.99,
                'status' => 'approved',
                'category' => 'Technology',
                'image' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Cybersecurity Workshop',
                'description' => 'Learn essential cybersecurity practices from certified security professionals. Covers threat assessment, penetration testing, and secure coding.',
                'location' => 'Seattle Tech Center, WA',
                'date' => Carbon::now()->addDays(35),
                'time' => '13:00:00',
                'capacity' => 60,
                'ticket_price' => 199.99,
                'status' => 'approved',
                'category' => 'Technology',
                'image' => 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Mobile App Development Workshop',
                'description' => 'Build your first mobile app using React Native. Hands-on workshop with experienced instructors.',
                'location' => 'Innovation Center, Portland, OR',
                'date' => Carbon::now()->addDays(28),
                'time' => '09:00:00',
                'capacity' => 40,
                'ticket_price' => 89.99,
                'status' => 'pending',
                'category' => 'Technology',
                'image' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format'
            ],

            // More Business Events
            [
                'title' => 'Digital Marketing Masterclass',
                'description' => 'Master the latest digital marketing strategies. Learn SEO, social media marketing, content strategy, and analytics with real-world case studies.',
                'location' => 'New York Marketing Hub, NY',
                'date' => Carbon::now()->addDays(28),
                'time' => '11:00:00',
                'capacity' => 150,
                'ticket_price' => 89.99,
                'status' => 'approved',
                'category' => 'Business',
                'image' => 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Leadership & Management Summit',
                'description' => 'Develop leadership skills and management techniques with industry executives and leadership coaches.',
                'location' => 'Business District, Dallas, TX',
                'date' => Carbon::now()->addDays(40),
                'time' => '08:00:00',
                'capacity' => 200,
                'ticket_price' => 199.99,
                'status' => 'approved',
                'category' => 'Business',
                'image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Small Business Finance Workshop',
                'description' => 'Learn financial management for small businesses including budgeting, cash flow, and investment strategies.',
                'location' => 'Community Center, Phoenix, AZ',
                'date' => Carbon::now()->addDays(33),
                'time' => '14:00:00',
                'capacity' => 75,
                'ticket_price' => 45.00,
                'status' => 'pending',
                'category' => 'Business',
                'image' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format'
            ],

            // More Entertainment Events
            [
                'title' => 'Comedy Night Spectacular',
                'description' => 'Laugh until your sides hurt with top comedians from around the country. Features both established performers and rising stars.',
                'location' => 'Comedy Theater, Los Angeles, CA',
                'date' => Carbon::now()->addDays(25),
                'time' => '21:00:00',
                'capacity' => 200,
                'ticket_price' => 35.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'image' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Indie Film Festival',
                'description' => 'Showcase of independent films from emerging filmmakers. Three days of screenings, Q&As, and networking.',
                'location' => 'Art Cinema, Minneapolis, MN',
                'date' => Carbon::now()->addDays(50),
                'time' => '18:00:00',
                'capacity' => 300,
                'ticket_price' => 65.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'image' => 'https://images.unsplash.com/photo-1489265278353-c7c5d2e5328a?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Local Band Showcase',
                'description' => 'Support local music talent at this community showcase featuring bands from the region.',
                'location' => 'Music Venue, Boulder, CO',
                'date' => Carbon::now()->addDays(17),
                'time' => '19:30:00',
                'capacity' => 150,
                'ticket_price' => 20.00,
                'status' => 'pending',
                'category' => 'Entertainment',
                'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format'
            ],

            // Sports Events
            [
                'title' => 'Youth Basketball Tournament',
                'description' => 'Competitive basketball tournament for youth teams ages 12-18. Features skilled young athletes and college scouts.',
                'location' => 'Sports Complex, Phoenix, AZ',
                'date' => Carbon::now()->addDays(40),
                'time' => '09:00:00',
                'capacity' => 500,
                'ticket_price' => 15.00,
                'status' => 'approved',
                'category' => 'Sports',
                'image' => 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Fitness Bootcamp Challenge',
                'description' => 'High-intensity fitness challenge for all fitness levels. Includes personal training sessions and nutrition workshops.',
                'location' => 'Outdoor Park, Miami, FL',
                'date' => Carbon::now()->addDays(26),
                'time' => '07:00:00',
                'capacity' => 100,
                'ticket_price' => 35.00,
                'status' => 'approved',
                'category' => 'Sports',
                'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format'
            ],

            // Education Events
            [
                'title' => 'Science Fair & STEM Expo',
                'description' => 'Interactive science demonstrations, robotics competitions, and STEM career showcases for students and families.',
                'location' => 'Science Museum, Boston, MA',
                'date' => Carbon::now()->addDays(33),
                'time' => '10:00:00',
                'capacity' => 600,
                'ticket_price' => 12.00,
                'status' => 'approved',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Adult Learning Workshop Series',
                'description' => 'Professional development workshops covering leadership, communication, project management, and career advancement.',
                'location' => 'Learning Center, Denver, CO',
                'date' => Carbon::now()->addDays(50),
                'time' => '18:30:00',
                'capacity' => 100,
                'ticket_price' => 65.00,
                'status' => 'approved',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Creative Writing Workshop',
                'description' => 'Improve your writing skills with published authors. Covers fiction, non-fiction, and poetry techniques.',
                'location' => 'Library, Portland, ME',
                'date' => Carbon::now()->addDays(21),
                'time' => '14:00:00',
                'capacity' => 30,
                'ticket_price' => 25.00,
                'status' => 'pending',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop&auto=format'
            ],

            // Health Events
            [
                'title' => 'Mental Health Awareness Workshop',
                'description' => 'Important workshop on mental health awareness, stress management, and wellness strategies with mental health professionals.',
                'location' => 'Community Health Center, Portland, OR',
                'date' => Carbon::now()->addDays(16),
                'time' => '14:00:00',
                'capacity' => 150,
                'ticket_price' => 20.00,
                'status' => 'approved',
                'category' => 'Health',
                'image' => 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Yoga & Meditation Retreat',
                'description' => 'Weekend retreat focusing on yoga practice, guided meditation, and holistic wellness. Includes healthy meals and accommodation.',
                'location' => 'Mountain Retreat Center, Asheville, NC',
                'date' => Carbon::now()->addDays(55),
                'time' => '16:00:00',
                'capacity' => 50,
                'ticket_price' => 195.00,
                'status' => 'approved',
                'category' => 'Health',
                'image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Nutrition & Healthy Cooking Class',
                'description' => 'Learn about nutrition and healthy cooking techniques with professional chefs and nutritionists.',
                'location' => 'Culinary School, San Diego, CA',
                'date' => Carbon::now()->addDays(30),
                'time' => '11:00:00',
                'capacity' => 40,
                'ticket_price' => 55.00,
                'status' => 'pending',
                'category' => 'Health',
                'image' => 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format'
            ],

            // Art & Culture Events
            [
                'title' => 'Modern Art Exhibition Opening',
                'description' => 'Grand opening of contemporary art exhibition featuring emerging and established artists exploring technology and society.',
                'location' => 'Metropolitan Art Gallery, Washington DC',
                'date' => Carbon::now()->addDays(8),
                'time' => '18:00:00',
                'capacity' => 250,
                'ticket_price' => 15.00,
                'status' => 'approved',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Photography Workshop',
                'description' => 'Learn professional photography techniques with award-winning photographers. Covers composition, lighting, and post-processing.',
                'location' => 'Photography Studio, Nashville, TN',
                'date' => Carbon::now()->addDays(24),
                'time' => '10:00:00',
                'capacity' => 25,
                'ticket_price' => 75.00,
                'status' => 'approved',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop&auto=format'
            ],

            // Food Events
            [
                'title' => 'Gourmet Food & Wine Festival',
                'description' => 'Indulge in exquisite cuisine and fine wines from renowned local restaurants and wineries. Features tastings and cooking demos.',
                'location' => 'Napa Valley Convention Center, CA',
                'date' => Carbon::now()->addDays(38),
                'time' => '12:00:00',
                'capacity' => 400,
                'ticket_price' => 85.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'image' => 'https://images.unsplash.com/photo-1567443024551-15e15d3e5b84?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'International Food Fair',
                'description' => 'Taste authentic cuisines from around the world. Family-friendly event with cultural performances and cooking demonstrations.',
                'location' => 'Convention Center, Houston, TX',
                'date' => Carbon::now()->addDays(45),
                'time' => '11:00:00',
                'capacity' => 800,
                'ticket_price' => 25.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&auto=format'
            ],

            // Some past events for testing
            [
                'title' => 'Tech Meetup - Past Event',
                'description' => 'Monthly tech meetup that already happened. Discussion on latest tech trends.',
                'location' => 'Tech Hub, Seattle, WA',
                'date' => Carbon::now()->subDays(5),
                'time' => '19:00:00',
                'capacity' => 100,
                'ticket_price' => 0.00,
                'status' => 'approved',
                'category' => 'Technology',
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format'
            ],
            [
                'title' => 'Community Art Show - Past',
                'description' => 'Local art exhibition that happened last week.',
                'location' => 'Community Center, Santa Fe, NM',
                'date' => Carbon::now()->subDays(7),
                'time' => '15:00:00',
                'capacity' => 200,
                'ticket_price' => 10.00,
                'status' => 'approved',
                'category' => 'Education',
                'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'
            ]
        ];

        // Create events
        foreach ($additionalEvents as $eventData) {
            $category = $categories->where('name', $eventData['category'])->first();
            if (!$category) {
                $this->command->warn("Category '{$eventData['category']}' not found, skipping event: {$eventData['title']}");
                continue;
            }

            // Randomly assign organizer
            $organizer = $organizers->random();
            
            $event = Event::firstOrCreate(
                ['title' => $eventData['title']],
                [
                    'title' => $eventData['title'],
                    'description' => $eventData['description'],
                    'location' => $eventData['location'],
                    'date' => $eventData['date'],
                    'time' => $eventData['time'],
                    'capacity' => $eventData['capacity'],
                    'ticket_price' => $eventData['ticket_price'],
                    'status' => $eventData['status'],
                    'category_id' => $category->id,
                    'organizer_id' => $organizer->id,
                    'image' => $eventData['image'],
                    'image_public_id' => null
                ]
            );

            // Add random attendees to approved events
            if ($event->status === 'approved' && $users->count() > 0) {
                $numAttendees = rand(1, min(6, $users->count()));
                $randomUsers = $users->random($numAttendees);
                foreach ($randomUsers as $user) {
                    $event->attendees()->syncWithoutDetaching([$user->id]);
                }
            }
        }

        $this->command->info('✅ Additional events seeder completed successfully!');
        $this->command->info('📊 Current database status:');
        $this->command->info('   • Approved events: ' . Event::where('status', 'approved')->count());
        $this->command->info('   • Pending events: ' . Event::where('status', 'pending')->count());
        $this->command->info('   • Rejected events: ' . Event::where('status', 'rejected')->count());
        $this->command->info('   • Total events: ' . Event::count());
        $this->command->info('   • Total users: ' . User::count());
        $this->command->info('   • Total categories: ' . EventCategory::count());
    }
}
