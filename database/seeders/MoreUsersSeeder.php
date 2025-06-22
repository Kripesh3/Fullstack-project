<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MoreUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Additional organizers
        $organizers = [
            [
                'name' => 'Sports Event Coordinator',
                'email' => 'sports@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0104',
                'bio' => 'Athletic event specialist focusing on community sports and fitness events.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Art & Culture Manager',
                'email' => 'arts@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0105',
                'bio' => 'Curator of cultural events, art exhibitions, and educational workshops.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Health & Wellness Expert',
                'email' => 'health@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0106',
                'bio' => 'Passionate about promoting health and wellness through community events.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Food & Culinary Events',
                'email' => 'food@eventease.com',
                'role' => 'organizer',
                'phone' => '+1-555-0107',
                'bio' => 'Professional culinary event organizer specializing in food festivals and cooking workshops.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        ];

        // Additional users (attendees)
        $users = [
            [
                'name' => 'Lisa Designer',
                'email' => 'lisa.designer@example.com',
                'role' => 'user',
                'phone' => '+1-555-0204',
                'bio' => 'UX/UI designer passionate about creative events and workshops.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'David Entrepreneur',
                'email' => 'david.entrepreneur@example.com',
                'role' => 'user',
                'phone' => '+1-555-0205',
                'bio' => 'Startup founder interested in business networking and growth strategies.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Emily Artist',
                'email' => 'emily.artist@example.com',
                'role' => 'user',
                'phone' => '+1-555-0206',
                'bio' => 'Local artist and art enthusiast who loves cultural events.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Alex Student',
                'email' => 'alex.student@example.com',
                'role' => 'user',
                'phone' => '+1-555-0207',
                'bio' => 'College student interested in technology and learning opportunities.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Maria Rodriguez',
                'email' => 'maria.rodriguez@example.com',
                'role' => 'user',
                'phone' => '+1-555-0208',
                'bio' => 'Marketing professional who enjoys networking events and professional development.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Chris Johnson',
                'email' => 'chris.johnson@example.com',
                'role' => 'user',
                'phone' => '+1-555-0209',
                'bio' => 'Fitness enthusiast and sports fan always looking for active community events.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rachel Green',
                'email' => 'rachel.green@example.com',
                'role' => 'user',
                'phone' => '+1-555-0210',
                'bio' => 'Healthcare worker passionate about wellness and mental health awareness.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Kevin Chen',
                'email' => 'kevin.chen@example.com',
                'role' => 'user',
                'phone' => '+1-555-0211',
                'bio' => 'Software engineer and tech enthusiast interested in coding workshops and conferences.',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        ];

        // Create organizers
        foreach ($organizers as $organizer) {
            User::firstOrCreate(
                ['email' => $organizer['email']],
                $organizer
            );
        }

        // Create users
        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user
            );
        }

        $this->command->info('✅ Additional users created successfully!');
        $this->command->info('📊 User summary:');
        $this->command->info('   • Admins: ' . User::where('role', 'admin')->count());
        $this->command->info('   • Organizers: ' . User::where('role', 'organizer')->count());
        $this->command->info('   • Users: ' . User::where('role', 'user')->count());
        $this->command->info('   • Total users: ' . User::count());
        $this->command->info('');
        $this->command->info('🔑 New login credentials (password: password123):');
        $this->command->info('📋 Organizers:');
        foreach ($organizers as $organizer) {
            $this->command->info('   • ' . $organizer['email']);
        }
        $this->command->info('👥 Users:');
        foreach ($users as $user) {
            $this->command->info('   • ' . $user['email']);
        }
    }
}
