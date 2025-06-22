<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ComprehensiveEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample event images from Unsplash (royalty-free)
        $eventImages = [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', // Conference
            'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop', // Music concert
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop', // Workshop
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop', // Networking
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', // Seminar
            'https://images.unsplash.com/photo-1544531585-81c0e8b8c0b3?w=800&h=600&fit=crop', // Sports
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', // Art exhibition
            'https://images.unsplash.com/photo-1567443024551-15e15d3e5b84?w=800&h=600&fit=crop', // Food festival
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop', // Training
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop', // Business meeting
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Health seminar
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', // Education
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop', // Technology
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', // Entertainment
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop', // Cultural event
        ];

        // Create 10 organizers
        $organizers = [];
        $organizerData = [
            ['name' => 'TechCorp Events', 'email' => 'organizer1@eventease.com', 'bio' => 'Leading technology conference organizer with 10+ years experience in Silicon Valley.'],
            ['name' => 'Creative Arts Studio', 'email' => 'organizer2@eventease.com', 'bio' => 'Passionate about bringing art and culture to communities through innovative events.'],
            ['name' => 'BusinessPro Conferences', 'email' => 'organizer3@eventease.com', 'bio' => 'Professional business conference organizer specializing in corporate training and networking.'],
            ['name' => 'Wellness World', 'email' => 'organizer4@eventease.com', 'bio' => 'Dedicated to promoting health and wellness through educational workshops and seminars.'],
            ['name' => 'SportsFest Organizers', 'email' => 'organizer5@eventease.com', 'bio' => 'Expert sports event organizers with a track record of successful marathons and tournaments.'],
            ['name' => 'EduTech Solutions', 'email' => 'organizer6@eventease.com', 'bio' => 'Educational technology company organizing workshops and training sessions for educators.'],
            ['name' => 'Music Makers Collective', 'email' => 'organizer7@eventease.com', 'bio' => 'Independent music event organizers promoting local and international artists.'],
            ['name' => 'Culinary Creations', 'email' => 'organizer8@eventease.com', 'bio' => 'Food festival organizers bringing together chefs and food enthusiasts from around the world.'],
            ['name' => 'Innovation Hub', 'email' => 'organizer9@eventease.com', 'bio' => 'Startup incubator organizing pitch competitions and entrepreneurship workshops.'],
            ['name' => 'Community Connect', 'email' => 'organizer10@eventease.com', 'bio' => 'Community-focused event organizer specializing in local engagement and social impact initiatives.'],
        ];

        foreach ($organizerData as $data) {
            $organizer = User::where('email', $data['email'])->first();
            if (!$organizer) {
                $organizer = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('password123'),
                    'role' => 'organizer', // Set correct role for organizers
                    'bio' => $data['bio'],
                    'phone' => '+1' . rand(1000000000, 9999999999),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $organizers[] = $organizer;
        }

        // Create 10 attendees
        $attendees = [];
        $attendeeData = [
            ['name' => 'John Smith', 'email' => 'john.smith@example.com'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson@example.com'],
            ['name' => 'Michael Brown', 'email' => 'michael.brown@example.com'],
            ['name' => 'Emily Davis', 'email' => 'emily.davis@example.com'],
            ['name' => 'David Wilson', 'email' => 'david.wilson@example.com'],
            ['name' => 'Jessica Garcia', 'email' => 'jessica.garcia@example.com'],
            ['name' => 'Robert Martinez', 'email' => 'robert.martinez@example.com'],
            ['name' => 'Ashley Lopez', 'email' => 'ashley.lopez@example.com'],
            ['name' => 'Christopher Anderson', 'email' => 'christopher.anderson@example.com'],
            ['name' => 'Amanda Taylor', 'email' => 'amanda.taylor@example.com'],
        ];

        foreach ($attendeeData as $data) {
            $attendee = User::where('email', $data['email'])->first();
            if (!$attendee) {
                $attendee = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'email_verified_at' => now(),
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'bio' => 'Event enthusiast looking for interesting events to attend.',
                    'phone' => '+1' . rand(1000000000, 9999999999),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $attendees[] = $attendee;
        }

        // Get all categories
        $categories = EventCategory::all();

        // Event templates for variety
        $eventTemplates = [
            // Technology Events
            [
                'titles' => ['Tech Innovation Summit', 'AI & Machine Learning Conference', 'Blockchain Workshop', 'Cybersecurity Seminar', 'Web Development Bootcamp'],
                'descriptions' => [
                    'Join industry leaders for cutting-edge discussions on emerging technologies, startup showcases, and networking opportunities with top investors.',
                    'Explore the latest in artificial intelligence and machine learning with hands-on workshops, expert panels, and real-world case studies.',
                    'Learn about blockchain technology, cryptocurrency, and decentralized applications from industry experts and successful entrepreneurs.',
                    'Stay ahead of cyber threats with expert insights on security best practices, threat detection, and risk management strategies.',
                    'Intensive hands-on training in modern web development frameworks, responsive design, and full-stack development techniques.'
                ],
                'category_id' => 1,
                'locations' => ['San Francisco Convention Center', 'Silicon Valley Tech Hub', 'Innovation District', 'Tech Campus Auditorium', 'Digital Innovation Center']
            ],
            // Business Events
            [
                'titles' => ['Leadership Excellence Summit', 'Startup Pitch Competition', 'Marketing Mastery Workshop', 'Financial Planning Seminar', 'Entrepreneurship Forum'],
                'descriptions' => [
                    'Develop your leadership skills with interactive workshops, executive coaching sessions, and insights from successful CEOs and industry leaders.',
                    'Watch promising startups pitch their ideas to investors, network with entrepreneurs, and discover the next big innovation in business.',
                    'Master modern marketing strategies including digital marketing, social media, content creation, and brand building for business success.',
                    'Learn essential financial planning strategies, investment principles, and wealth management techniques from certified financial advisors.',
                    'Connect with fellow entrepreneurs, share experiences, and learn from successful business founders in various industries.'
                ],
                'category_id' => 2,
                'locations' => ['Business District Center', 'Corporate Training Facility', 'Executive Conference Room', 'Startup Incubator', 'Professional Development Center']
            ],
            // Education Events
            [
                'titles' => ['EdTech Innovation Conference', 'Teaching Excellence Workshop', 'STEM Education Summit', 'Student Success Seminar', 'Learning Analytics Forum'],
                'descriptions' => [
                    'Discover innovative educational technologies, digital learning platforms, and tools that are revolutionizing modern education.',
                    'Enhance your teaching skills with proven pedagogical strategies, classroom management techniques, and student engagement methods.',
                    'Explore hands-on STEM education approaches, maker spaces, robotics, and inspiring the next generation of scientists and engineers.',
                    'Learn effective strategies for student retention, academic success, and creating supportive learning environments.',
                    'Understand how data analytics can improve educational outcomes, track student progress, and optimize learning experiences.'
                ],
                'category_id' => 3,
                'locations' => ['University Conference Center', 'Educational Innovation Hub', 'Teacher Training Center', 'Academic Excellence Center', 'Learning Innovation Lab']
            ],
            // Entertainment Events
            [
                'titles' => ['Music Festival Showcase', 'Comedy Night Extravaganza', 'Film Screening Premiere', 'Dance Performance Gala', 'Theater Arts Workshop'],
                'descriptions' => [
                    'Experience an unforgettable night of music featuring local and international artists across multiple genres and stages.',
                    'Laugh out loud with top comedians performing stand-up, improv, and sketch comedy in an intimate venue setting.',
                    'Be among the first to watch exclusive film premieres, documentaries, and independent cinema with director Q&A sessions.',
                    'Witness spectacular dance performances from classical ballet to contemporary and cultural dance from around the world.',
                    'Learn theater arts techniques including acting, directing, stagecraft, and performance skills from industry professionals.'
                ],
                'category_id' => 4,
                'locations' => ['Downtown Theater', 'Music Venue', 'Comedy Club', 'Cultural Arts Center', 'Performance Hall']
            ],
            // Sports Events
            [
                'titles' => ['Marathon Training Camp', 'Basketball Tournament', 'Fitness Bootcamp Challenge', 'Yoga Retreat Weekend', 'Swimming Competition'],
                'descriptions' => [
                    'Comprehensive marathon training program with professional coaches, nutrition guidance, and injury prevention strategies.',
                    'Competitive basketball tournament featuring local teams, skilled players, and prizes for winners in multiple divisions.',
                    'High-intensity fitness bootcamp combining strength training, cardio, and functional movements for all fitness levels.',
                    'Relaxing yoga retreat focusing on mindfulness, flexibility, stress relief, and connecting with nature in a peaceful setting.',
                    'Competitive swimming event with multiple categories, professional timing, and recognition for outstanding performances.'
                ],
                'category_id' => 5,
                'locations' => ['Sports Complex', 'Recreation Center', 'Fitness Studio', 'Community Pool', 'Athletic Center']
            ],
            // Health Events
            [
                'titles' => ['Wellness Workshop Series', 'Mental Health Awareness Seminar', 'Nutrition Education Program', 'Fitness & Wellness Expo', 'Mindfulness Meditation Retreat'],
                'descriptions' => [
                    'Comprehensive wellness education covering physical health, mental wellbeing, stress management, and healthy lifestyle choices.',
                    'Important discussions about mental health awareness, reducing stigma, coping strategies, and community support resources.',
                    'Learn about proper nutrition, meal planning, dietary supplements, and how food choices impact overall health and energy.',
                    'Explore the latest in fitness equipment, health products, wellness services, and connect with health professionals.',
                    'Peaceful meditation retreat focusing on mindfulness practices, stress reduction, and inner peace in a serene environment.'
                ],
                'category_id' => 6,
                'locations' => ['Wellness Center', 'Community Health Clinic', 'Meditation Center', 'Health & Fitness Expo Hall', 'Holistic Health Center']
            ],
            // Arts & Culture Events
            [
                'titles' => ['Art Gallery Opening', 'Cultural Heritage Festival', 'Photography Exhibition', 'Craft Workshop Series', 'Literary Reading Event'],
                'descriptions' => [
                    'Celebrate the opening of a new art exhibition featuring works by local and international artists across various mediums.',
                    'Experience rich cultural traditions through music, dance, food, and art from diverse communities and ethnic backgrounds.',
                    'Stunning photography exhibition showcasing landscapes, portraits, street photography, and documentary work by talented photographers.',
                    'Hands-on craft workshops teaching traditional and modern techniques in pottery, painting, jewelry making, and textile arts.',
                    'Evening of literary readings featuring published authors, poets, and emerging writers sharing their latest works.'
                ],
                'category_id' => 7,
                'locations' => ['Art Gallery', 'Cultural Center', 'Museum', 'Community Arts Center', 'Library Event Space']
            ],
            // Food & Drink Events
            [
                'titles' => ['Food Festival Celebration', 'Wine Tasting Experience', 'Cooking Class Workshop', 'Restaurant Week Launch', 'Craft Beer Festival'],
                'descriptions' => [
                    'Culinary celebration featuring diverse cuisines, food trucks, local restaurants, and cooking demonstrations by renowned chefs.',
                    'Sophisticated wine tasting event featuring selections from local and international vineyards with expert sommelier guidance.',
                    'Interactive cooking class learning techniques from professional chefs, including knife skills, flavor pairing, and presentation.',
                    'Kickoff event for restaurant week featuring special menus, chef showcases, and exclusive dining experiences.',
                    'Craft beer festival celebrating local breweries, unique flavors, brewing techniques, and food pairings with beer experts.'
                ],
                'category_id' => 8,
                'locations' => ['Food Festival Grounds', 'Wine Bar', 'Culinary Institute', 'Restaurant District', 'Brewery Taproom']
            ]
        ];

        // Create 5 events for each organizer
        $statuses = ['approved', 'approved', 'approved', 'pending', 'pending']; // 60% approved, 40% pending
        $eventCount = 0;

        foreach ($organizers as $index => $organizer) {
            $templateIndex = $index % count($eventTemplates);
            $template = $eventTemplates[$templateIndex];
            
            for ($i = 0; $i < 5; $i++) {
                $baseDate = now()->addDays(rand(1, 90));
                $event = Event::create([
                    'title' => $template['titles'][$i],
                    'description' => $template['descriptions'][$i],
                    'location' => $template['locations'][$i],
                    'date' => $baseDate->format('Y-m-d'),
                    'time' => $baseDate->format('H:i:s'),
                    'capacity' => rand(50, 500),
                    'ticket_price' => rand(0, 200),
                    'image' => $eventImages[$eventCount % count($eventImages)],
                    'category_id' => $template['category_id'],
                    'organizer_id' => $organizer->id,
                    'status' => $statuses[$i],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Add some attendees to approved events (simplified)
                if ($event->status === 'approved' && rand(1, 10) > 3 && count($attendees) > 0) {
                    $numAttendees = rand(1, min(3, count($attendees)));
                    $selectedAttendees = array_slice($attendees, 0, $numAttendees);
                    
                    foreach ($selectedAttendees as $attendee) {
                        try {
                            $event->attendees()->attach($attendee->id, [
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        } catch (\Exception $e) {
                            // Skip if already attached
                            continue;
                        }
                    }
                }

                $eventCount++;
            }
        }

        $this->command->info('Successfully created:');
        $this->command->info('- 10 Organizers (each with 5 events)');
        $this->command->info('- 10 Attendees');
        $this->command->info('- 50 Total Events (30 approved, 20 pending)');
        $this->command->info('- Events distributed across all categories');
        $this->command->info('- Random attendee registrations for approved events');
    }
}
