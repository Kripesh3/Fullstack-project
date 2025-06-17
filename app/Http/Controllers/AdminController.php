<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;

// app/Http/Controllers/AdminController.php
class AdminController extends Controller
{
    public function approveEvent($id)
    {
        $event = Event::findOrFail($id);
        $event->status = 'approved';
        $event->save();
        return response()->json(['message' => 'Event approved']);
    }

    public function rejectEvent($id)
    {
        $event = Event::findOrFail($id);
        $event->status = 'rejected';
        $event->save();
        return response()->json(['message' => 'Event rejected']);
    }

    public function users()
    {
        return response()->json(User::all());
    }

    public function events()
    {
        return response()->json(Event::with('category', 'organizer')->get());
    }

    public function banUser($id)
    {
        $user = User::findOrFail($id);
        $user->banned = true;
        $user->save();
        return response()->json(['message' => 'User banned']);
    }

    public function warnUser($id)
    {
        // Implement warning logic (e.g., send notification)
        return response()->json(['message' => 'User warned']);
    }
}

