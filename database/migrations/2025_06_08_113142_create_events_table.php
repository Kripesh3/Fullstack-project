<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    // database/migrations/xxxx_xx_xx_create_events_table.php
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users');
            $table->foreignId('category_id')->constrained('event_categories');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->date('date');
            $table->time('time');
            $table->integer('capacity');
            $table->string('image')->nullable(); // Cloudinary URL
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
