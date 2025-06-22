<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class CompleteEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create additional organizers
        $organizers = [
            [
                'name' => 'Tech Conference Organizer',
                'email' => 'tech@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0101',
                'bio' => 'Specialized in organizing technology conferences and workshops for developers and tech enthusiasts.'
            ],
            [
                'name' => 'Music Events Manager',
                'email' => 'music@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0102',
                'bio' => 'Passionate about bringing amazing musical experiences to life. 10+ years in event management.'
            ],
            [
                'name' => 'Business Networking Pro',
                'email' => 'business@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0103',
                'bio' => 'Expert in corporate events and professional networking gatherings.'
            ],
            [
                'name' => 'Sports Event Coordinator',
                'email' => 'sports@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0104',
                'bio' => 'Athletic event specialist focusing on community sports and fitness events.'
            ],
            [
                'name' => 'Art & Culture Manager',
                'email' => 'arts@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0105',
                'bio' => 'Curator of cultural events, art exhibitions, and educational workshops.'
            ]
        ];

        $createdOrganizers = [];
        foreach ($organizers as $organizer) {
            $createdOrganizers[] = User::firstOrCreate(
                ['email' => $organizer['email']],
                array_merge($organizer, ['password' => Hash::make('password123')])
            );
        }

        // Create attendees
        $attendees = [
            [
                'name' => 'John Developer',
                'email' => 'john.dev@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0201',
                'bio' => 'Full-stack developer interested in new technologies and networking.'
            ],
            [
                'name' => 'Sarah Marketing',
                'email' => 'sarah.marketing@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0202',
                'bio' => 'Digital marketing specialist always looking for industry insights.'
            ],
            [
                'name' => 'Mike Student',
                'email' => 'mike.student@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0203',
                'bio' => 'Computer science student eager to learn and grow.'
            ],
            [
                'name' => 'Lisa Designer',
                'email' => 'lisa.designer@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0204',
                'bio' => 'UX/UI designer passionate about creative events and workshops.'
            ],
            [
                'name' => 'David Entrepreneur',
                'email' => 'david.entrepreneur@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0205',
                'bio' => 'Startup founder interested in business networking and growth strategies.'
            ],
            [
                'name' => 'Emily Artist',
                'email' => 'emily.artist@example.com',
                'role' => 'attendee',
                'phone' => '+1-555-0206',
                'bio' => 'Local artist and art enthusiast who loves cultural events.'
            ]
        ];

        $createdAttendees = [];
        foreach ($attendees as $attendee) {
            $createdAttendees[] = User::firstOrCreate(
                ['email' => $attendee['email']],
                array_merge($attendee, ['password' => Hash::make('password123')])
            );
        }

        // Get categories
        $categories = EventCategory::all();
        if ($categories->isEmpty()) {
            // Create categories if they don't exist
            $categoryData = [
                ['name' => 'Technology', 'description' => 'Tech conferences, workshops, and meetups'],
                ['name' => 'Business', 'description' => 'Business conferences and networking events'],
                ['name' => 'Education', 'description' => 'Educational workshops and seminars'],
                ['name' => 'Entertainment', 'description' => 'Concerts, shows, and entertainment events'],
                ['name' => 'Sports', 'description' => 'Sports events and competitions'],
                ['name' => 'Health', 'description' => 'Health and wellness events'],
            ];

            foreach ($categoryData as $category) {
                EventCategory::firstOrCreate(['name' => $category['name']], $category);
            }
            $categories = EventCategory::all();
        }

        // Event images (using Unsplash for variety)
        $eventImages = [
            // Technology events
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&auto=format', // Conference
            'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&auto=format', // Coding
            'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop&auto=format', // Tech workshop
            
            // Business events
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&auto=format', // Workshop
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&auto=format', // Networking
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format', // Seminar
            
            // Entertainment events
            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&auto=format', // Music concert
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format', // Concert hall
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format', // Theater
            
            // Sports events
            'https://images.unsplash.com/photo-1544531585-81c0e8b8c0b3?w=800&h=600&fit=crop&auto=format', // Sports
            'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&h=600&fit=crop&auto=format', // Running
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format', // Fitness
            
            // Education events
            'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&auto=format', // Education
            'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&auto=format', // Learning
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&auto=format', // Group learning
            
            // Art & Culture events
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format', // Art exhibition
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', // Art gallery
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop&auto=format', // Museum
            
            // Food events
            'https://images.unsplash.com/photo-1567443024551-15e15d3e5b84?w=800&h=600&fit=crop&auto=format', // Food festival
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&auto=format', // Cooking
        ];

        // Comprehensive event data
        $events = [
            // APPROVED TECHNOLOGY EVENTS
            [
                'title' => 'AI & Machine Learning Summit 2025',
                'description' => 'Join industry leaders and experts for a comprehensive exploration of artificial intelligence and machine learning technologies. This summit will feature keynote speeches from top AI researchers, hands-on workshops, and networking opportunities with fellow tech professionals. Topics include deep learning, neural networks, computer vision, and practical AI applications in business.',
                'location' => 'San Francisco Convention Center, CA',
                'date' => Carbon::now()->addDays(15),
                'time' => '09:00:00',
                'capacity' => 500,
                'ticket_price' => 299.99,
                'status' => 'approved',
                'category' => 'Technology',
                'organizer_index' => 0,
                'image_index' => 0
            ],
            [
                'title' => 'Web Development Bootcamp',
                'description' => 'Intensive 2-day workshop covering modern web development technologies including React, Node.js, and MongoDB. Perfect for developers looking to upgrade their skills or beginners wanting to start their coding journey. Includes hands-on projects, code reviews, and career guidance from industry professionals.',
                'location' => 'Tech Hub, Austin, TX',
                'date' => Carbon::now()->addDays(22),
                'time' => '10:00:00',
                'capacity' => 80,
                'ticket_price' => 149.99,
                'status' => 'approved',
                'category' => 'Technology',
                'organizer_index' => 0,
                'image_index' => 1
            ],
            [
                'title' => 'Cybersecurity Workshop',
                'description' => 'Learn essential cybersecurity practices and techniques from certified security professionals. This workshop covers threat assessment, penetration testing, secure coding practices, and incident response. Ideal for IT professionals, developers, and business owners concerned about digital security.',
                'location' => 'Seattle Tech Center, WA',
                'date' => Carbon::now()->addDays(35),
                'time' => '13:00:00',
                'capacity' => 60,
                'ticket_price' => 199.99,
                'status' => 'approved',
                'category' => 'Technology',
                'organizer_index' => 0,
                'image_index' => 2
            ],

            // PENDING TECHNOLOGY EVENTS
            [
                'title' => 'Blockchain & Cryptocurrency Conference',
                'description' => 'Explore the future of finance and technology with blockchain experts and cryptocurrency pioneers. Sessions include DeFi innovations, NFT marketplace development, smart contract programming, and regulatory compliance in the crypto space.',
                'location' => 'Miami Beach Convention Center, FL',
                'date' => Carbon::now()->addDays(45),
                'time' => '09:30:00',
                'capacity' => 300,
                'ticket_price' => 249.99,
                'status' => 'pending',
                'category' => 'Technology',
                'organizer_index' => 0,
                'image_index' => 0
            ],

            // APPROVED BUSINESS EVENTS
            [
                'title' => 'Entrepreneurship & Startup Expo',
                'description' => 'Connect with investors, mentors, and fellow entrepreneurs at the largest startup expo in the region. Features pitch competitions, funding workshops, market research sessions, and one-on-one meetings with venture capitalists. Perfect for early-stage startups and aspiring entrepreneurs.',
                'location' => 'Chicago Business District, IL',
                'date' => Carbon::now()->addDays(18),
                'time' => '08:30:00',
                'capacity' => 400,
                'ticket_price' => 179.99,
                'status' => 'approved',
                'category' => 'Business',
                'organizer_index' => 2,
                'image_index' => 3
            ],
            [
                'title' => 'Digital Marketing Masterclass',
                'description' => 'Master the latest digital marketing strategies and tools with industry experts. Learn about SEO optimization, social media marketing, content strategy, email campaigns, and analytics. Includes practical exercises and real-world case studies from successful marketing campaigns.',
                'location' => 'New York Marketing Hub, NY',
                'date' => Carbon::now()->addDays(28),
                'time' => '11:00:00',
                'capacity' => 150,
                'ticket_price' => 89.99,
                'status' => 'approved',
                'category' => 'Business',
                'organizer_index' => 2,
                'image_index' => 4
            ],

            // REJECTED BUSINESS EVENT
            [
                'title' => 'Questionable Investment Seminar',
                'description' => 'Learn about high-risk investment strategies and get-rich-quick schemes.',
                'location' => 'Unknown Location',
                'date' => Carbon::now()->addDays(10),
                'time' => '19:00:00',
                'capacity' => 50,
                'ticket_price' => 500.00,
                'status' => 'rejected',
                'category' => 'Business',
                'organizer_index' => 2,
                'image_index' => 5
            ],

            // APPROVED ENTERTAINMENT EVENTS
            [
                'title' => 'Summer Music Festival 2025',
                'description' => 'Three days of incredible live music featuring local and international artists across multiple genres. From indie rock to electronic dance music, jazz to hip-hop, there\'s something for every music lover. Food trucks, art installations, and interactive experiences complete this unforgettable festival.',
                'location' => 'Golden Gate Park, San Francisco, CA',
                'date' => Carbon::now()->addDays(60),
                'time' => '14:00:00',
                'capacity' => 2000,
                'ticket_price' => 125.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'organizer_index' => 1,
                'image_index' => 6
            ],
            [
                'title' => 'Jazz Night at the Blue Note',
                'description' => 'An intimate evening of smooth jazz featuring renowned musicians and emerging talents. Enjoy classic cocktails and gourmet appetizers while listening to soulful performances in an authentic jazz club atmosphere. Limited seating for an exclusive experience.',
                'location' => 'Blue Note Jazz Club, Nashville, TN',
                'date' => Carbon::now()->addDays(12),
                'time' => '20:00:00',
                'capacity' => 120,
                'ticket_price' => 45.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'organizer_index' => 1,
                'image_index' => 7
            ],
            [
                'title' => 'Comedy Night Spectacular',
                'description' => 'Laugh until your sides hurt with top comedians from around the country. This comedy showcase features both established performers and rising stars in stand-up comedy. A perfect night out for friends, date night, or anyone who loves to laugh.',
                'location' => 'Comedy Theater, Los Angeles, CA',
                'date' => Carbon::now()->addDays(25),
                'time' => '21:00:00',
                'capacity' => 200,
                'ticket_price' => 35.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'organizer_index' => 1,
                'image_index' => 8
            ],

            // PENDING ENTERTAINMENT EVENT
            [
                'title' => 'Underground DJ Battle',
                'description' => 'Electronic music event featuring upcoming DJs and producers.',
                'location' => 'Warehouse District, Detroit, MI',
                'date' => Carbon::now()->addDays(30),
                'time' => '22:00:00',
                'capacity' => 300,
                'ticket_price' => 25.00,
                'status' => 'pending',
                'category' => 'Entertainment',
                'organizer_index' => 1,
                'image_index' => 6
            ],

            // APPROVED SPORTS EVENTS
            [
                'title' => 'Community 5K Fun Run',
                'description' => 'Join hundreds of runners for our annual community 5K fun run supporting local charities. This family-friendly event welcomes runners and walkers of all skill levels. Includes post-race refreshments, prizes for various categories, and activities for children.',
                'location' => 'Central Park, New York, NY',
                'date' => Carbon::now()->addDays(20),
                'time' => '08:00:00',
                'capacity' => 800,
                'ticket_price' => 25.00,
                'status' => 'approved',
                'category' => 'Sports',
                'organizer_index' => 3,
                'image_index' => 9
            ],
            [
                'title' => 'Youth Basketball Tournament',
                'description' => 'Competitive basketball tournament for youth teams ages 12-18. Teams from across the state will compete in this weekend tournament featuring skilled young athletes. Includes awards ceremony, college scout attendance, and skills development workshops.',
                'location' => 'Sports Complex, Phoenix, AZ',
                'date' => Carbon::now()->addDays(40),
                'time' => '09:00:00',
                'capacity' => 500,
                'ticket_price' => 15.00,
                'status' => 'approved',
                'category' => 'Sports',
                'organizer_index' => 3,
                'image_index' => 10
            ],

            // APPROVED EDUCATION EVENTS
            [
                'title' => 'Science Fair & STEM Expo',
                'description' => 'Inspiring young minds through interactive science demonstrations, robotics competitions, and STEM career showcases. Students from elementary through high school will present their projects while visitors can participate in hands-on experiments and meet scientists from various fields.',
                'location' => 'Science Museum, Boston, MA',
                'date' => Carbon::now()->addDays(33),
                'time' => '10:00:00',
                'capacity' => 600,
                'ticket_price' => 12.00,
                'status' => 'approved',
                'category' => 'Education',
                'organizer_index' => 4,
                'image_index' => 11
            ],
            [
                'title' => 'Adult Learning Workshop Series',
                'description' => 'Professional development workshops covering leadership skills, communication techniques, project management, and career advancement strategies. Designed for working professionals looking to enhance their skills and advance their careers.',
                'location' => 'Learning Center, Denver, CO',
                'date' => Carbon::now()->addDays(50),
                'time' => '18:30:00',
                'capacity' => 100,
                'ticket_price' => 65.00,
                'status' => 'approved',
                'category' => 'Education',
                'organizer_index' => 4,
                'image_index' => 12
            ],

            // PENDING EDUCATION EVENT
            [
                'title' => 'Online Learning Platform Demo',
                'description' => 'Demonstration of new educational technology platform.',
                'location' => 'Virtual Event',
                'date' => Carbon::now()->addDays(14),
                'time' => '15:00:00',
                'capacity' => 1000,
                'ticket_price' => 0.00,
                'status' => 'pending',
                'category' => 'Education',
                'organizer_index' => 4,
                'image_index' => 13
            ],

            // APPROVED HEALTH EVENTS
            [
                'title' => 'Mental Health Awareness Workshop',
                'description' => 'Important workshop addressing mental health awareness, stress management techniques, and wellness strategies. Mental health professionals will share insights on maintaining psychological well-being, recognizing warning signs, and accessing support resources.',
                'location' => 'Community Health Center, Portland, OR',
                'date' => Carbon::now()->addDays(16),
                'time' => '14:00:00',
                'capacity' => 150,
                'ticket_price' => 20.00,
                'status' => 'approved',
                'category' => 'Health',
                'organizer_index' => 4,
                'image_index' => 14
            ],
            [
                'title' => 'Yoga & Meditation Retreat',
                'description' => 'Weekend retreat focusing on yoga practice, guided meditation, and holistic wellness. Suitable for beginners and experienced practitioners. Includes healthy meals, accommodation, and workshops on mindfulness and stress reduction techniques.',
                'location' => 'Mountain Retreat Center, Asheville, NC',
                'date' => Carbon::now()->addDays(55),
                'time' => '16:00:00',
                'capacity' => 50,
                'ticket_price' => 195.00,
                'status' => 'approved',
                'category' => 'Health',
                'organizer_index' => 4,
                'image_index' => 15
            ],

            // ART & CULTURE EVENTS (some approved, some pending)
            [
                'title' => 'Modern Art Exhibition Opening',
                'description' => 'Grand opening of our contemporary art exhibition featuring works from emerging and established artists. The exhibition explores themes of technology, society, and human connection through various media including paintings, sculptures, and digital installations.',
                'location' => 'Metropolitan Art Gallery, Washington DC',
                'date' => Carbon::now()->addDays(8),
                'time' => '18:00:00',
                'capacity' => 250,
                'ticket_price' => 15.00,
                'status' => 'approved',
                'category' => 'Education',
                'organizer_index' => 4,
                'image_index' => 16
            ],
            [
                'title' => 'Cultural Heritage Festival',
                'description' => 'Celebrate diverse cultural traditions with music, dance, food, and art from around the world. This family-friendly festival showcases the rich cultural heritage of our community through performances, workshops, and interactive exhibits.',
                'location' => 'Cultural District, San Antonio, TX',
                'date' => Carbon::now()->addDays(42),
                'time' => '11:00:00',
                'capacity' => 1500,
                'ticket_price' => 10.00,
                'status' => 'pending',
                'category' => 'Entertainment',
                'organizer_index' => 4,
                'image_index' => 17
            ],

            // FOOD EVENTS
            [
                'title' => 'Gourmet Food & Wine Festival',
                'description' => 'Indulge in exquisite cuisine and fine wines from renowned local restaurants and wineries. This upscale culinary event features tastings, cooking demonstrations by celebrity chefs, and wine pairing workshops. A must-attend event for food enthusiasts.',
                'location' => 'Napa Valley Convention Center, CA',
                'date' => Carbon::now()->addDays(38),
                'time' => '12:00:00',
                'capacity' => 400,
                'ticket_price' => 85.00,
                'status' => 'approved',
                'category' => 'Entertainment',
                'organizer_index' => 1,
                'image_index' => 18
            ],

            // PAST EVENTS (for testing)
            [
                'title' => 'Tech Meetup - Past Event',
                'description' => 'Monthly tech meetup that already happened.',
                'location' => 'Tech Hub, Seattle, WA',
                'date' => Carbon::now()->subDays(5),
                'time' => '19:00:00',
                'capacity' => 100,
                'ticket_price' => 0.00,
                'status' => 'approved',
                'category' => 'Technology',
                'organizer_index' => 0,
                'image_index' => 1
            ]
        ];

        // Create events
        foreach ($events as $eventData) {
            $category = $categories->where('name', $eventData['category'])->first();
            $organizer = $createdOrganizers[$eventData['organizer_index']];
            
            $event = Event::create([
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
                'image' => $eventImages[$eventData['image_index']],
                'image_public_id' => null // Since we're using direct URLs
            ]);

            // Add some random attendees to approved events
            if ($eventData['status'] === 'approved' && $eventData['date']->isFuture()) {
                $randomAttendees = collect($createdAttendees)->random(rand(2, 4));
                foreach ($randomAttendees as $attendee) {
                    $event->attendees()->attach($attendee->id);
                }
            }
        }

        $this->command->info('✅ Complete event seeder completed successfully!');
        $this->command->info('📊 Created:');
        $this->command->info('   • ' . count($organizers) . ' organizers');
        $this->command->info('   • ' . count($attendees) . ' attendees');
        $this->command->info('   • ' . count($events) . ' events with various statuses');
        $this->command->info('   • Random event registrations');
        $this->command->info('');
        $this->command->info('🔑 Login credentials (password: password123):');
        foreach ($organizers as $organizer) {
            $this->command->info('   • ' . $organizer['email'] . ' (' . $organizer['role'] . ')');
        }
        foreach ($attendees as $attendee) {
            $this->command->info('   • ' . $attendee['email'] . ' (' . $attendee['role'] . ')');
        }
    }
}
