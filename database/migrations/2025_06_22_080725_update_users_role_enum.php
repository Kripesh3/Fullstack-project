<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table with the new enum values
        // First, let's update any existing 'user' roles to 'attendee'
        DB::statement("UPDATE users SET role = 'attendee' WHERE role = 'user'");
        
        // Since SQLite doesn't support ALTER COLUMN for enum changes,
        // we'll create a new table, copy data, and replace the old one
        Schema::create('users_new', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['attendee', 'organizer', 'admin'])->default('attendee');
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('avatar_public_id')->nullable();
            $table->boolean('banned')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        // Copy data from old table to new table
        DB::statement("INSERT INTO users_new SELECT * FROM users");

        // Drop old table and rename new table
        Schema::drop('users');
        Schema::rename('users_new', 'users');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse the changes - change 'attendee' back to 'user'
        DB::statement("UPDATE users SET role = 'user' WHERE role = 'attendee'");
        
        Schema::create('users_old', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['user', 'organizer', 'admin'])->default('user');
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->boolean('banned')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        // Copy data back
        DB::statement("INSERT INTO users_old SELECT id, name, email, email_verified_at, password, role, phone, bio, avatar, banned, remember_token, created_at, updated_at FROM users");

        // Drop new table and rename old table back
        Schema::drop('users');
        Schema::rename('users_old', 'users');
    }
};
