<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'location' => $this->faker->city,
            'date' => $this->faker->date,
            'time' => $this->faker->time,
            'capacity' => $this->faker->numberBetween(10, 100),
            'status' => 'approved',
            // 'organizer_id' and 'category_id' should be set explicitly in seeder
        ];
    }
}
