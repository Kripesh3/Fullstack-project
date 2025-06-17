<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\EventCategory;
use App\Models\Event;
use Illuminate\Support\Str;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Create or get the admin user to avoid duplicate entry errors
        $admin = User::firstOrCreate(
            ['email' => 'admin@eventease.com'],
            [
                'name' => 'Admin',
                'role' => 'admin',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );

        // Create organizers and users
        $organizers = User::factory(5)->create(['role' => 'organizer']);
        User::factory(20)->create(['role' => 'user']);

        // Create event categories only if they don't exist
        $conference = EventCategory::firstOrCreate(['name' => 'Conference']);
        $workshop   = EventCategory::firstOrCreate(['name' => 'Workshop']);
        $meetup     = EventCategory::firstOrCreate(['name' => 'Meetup']);

        // Create demo events for each organizer
        foreach ($organizers as $organizer) {
            Event::factory()->create([
                'organizer_id' => $organizer->id,
                'category_id'  => $conference->id,
                'title'        => 'Tech Innovations Summit',
                'description'  => 'A conference on the latest in tech.',
                'location'     => 'Kathmandu, Nepal',
                'date'         => Carbon::now()->addDays(10)->toDateString(),
                'time'         => '10:00:00',
                'capacity'     => 100,
                'status'       => 'approved',
            ]);
            Event::factory()->create([
                'organizer_id' => $organizer->id,
                'category_id'  => $workshop->id,
                'title'        => 'Laravel Mastery Workshop',
                'description'  => 'Hands-on Laravel workshop.',
                'location'     => 'Pokhara, Nepal',
                'date'         => Carbon::now()->addDays(20)->toDateString(),
                'time'         => '09:00:00',
                'capacity'     => 50,
                'status'       => 'approved',
            ]);
            Event::factory()->create([
                'organizer_id' => $organizer->id,
                'category_id'  => $meetup->id,
                'title'        => 'React Devs Meetup',
                'description'  => 'Networking for React developers.',
                'location'     => 'Lalitpur, Nepal',
                'date'         => Carbon::now()->addDays(30)->toDateString(),
                'time'         => '17:00:00',
                'capacity'     => 30,
                'status'       => 'approved',
            ]);
        }
    }
}
