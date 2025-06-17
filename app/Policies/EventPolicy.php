<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\Response;

// app/Policies/EventPolicy.php
class EventPolicy
{
    public function create(User $user)
    {
        return $user->role === 'organizer' && !$user->banned;
    }

    public function update(User $user, Event $event)
    {
        return $user->id === $event->organizer_id && !$user->banned;
    }

    public function delete(User $user, Event $event)
    {
        return $user->id === $event->organizer_id && !$user->banned;
    }
}
