<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventCategory;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'description' => 'Tech conferences, workshops, and meetups', 'icon' => 'fas fa-laptop-code'],
            ['name' => 'Business', 'description' => 'Business conferences and networking events', 'icon' => 'fas fa-briefcase'],
            ['name' => 'Education', 'description' => 'Educational workshops and seminars', 'icon' => 'fas fa-graduation-cap'],
            ['name' => 'Entertainment', 'description' => 'Concerts, shows, and entertainment events', 'icon' => 'fas fa-music'],
            ['name' => 'Sports', 'description' => 'Sports events and competitions', 'icon' => 'fas fa-running'],
            ['name' => 'Health', 'description' => 'Health and wellness events', 'icon' => 'fas fa-heartbeat'],
            ['name' => 'Art & Culture', 'description' => 'Art exhibitions, cultural events', 'icon' => 'fas fa-palette'],
            ['name' => 'Food & Drink', 'description' => 'Food festivals, cooking workshops', 'icon' => 'fas fa-utensils'],
        ];

        foreach ($categories as $category) {
            \App\Models\EventCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }

        $this->command->info('Event categories seeded successfully!');
    }
}
