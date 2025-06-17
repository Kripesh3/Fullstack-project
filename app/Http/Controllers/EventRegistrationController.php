<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Notifications\EventRegistrationConfirmed;

// app/Http/Controllers/EventRegistrationController.php
class EventRegistrationController extends Controller
{
    public function register(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);

        if ($event->status !== 'approved') {
            return response()->json(['message' => 'Event not available'], 403);
        }

        if ($event->attendees()->count() >= $event->capacity) {
            return response()->json(['message' => 'Event is full'], 409);
        }

        if ($event->attendees()->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['message' => 'Already registered'], 409);
        }

        $event->attendees()->attach($request->user()->id);

        // Send confirmation email (implement Notification)
        $request->user()->notify(new EventRegistrationConfirmed());

        return response()->json(['message' => 'Registered']);
    }

    public function unregister(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        $event->attendees()->detach($request->user()->id);
        return response()->json(['message' => 'Registration cancelled']);
    }
}

