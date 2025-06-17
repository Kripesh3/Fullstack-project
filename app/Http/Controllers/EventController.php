<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Services\CloudinaryService;
use App\Http\Requests\Event\EventStoreRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $query = Event::where('status', 'approved');

        // Filters: category, date, location
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('date')) {
            $query->where('date', $request->date);
        }
        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        $events = $query->with('category', 'organizer', 'attendees')->paginate(10);
        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::with('category', 'organizer', 'attendees')->findOrFail($id);
        if ($event->status !== 'approved') {
            abort(404);
        }
        return response()->json($event);
    }

    public function store(EventStoreRequest $request, CloudinaryService $cloudinary)
    {
        $this->authorize('create', Event::class);

        $data = $request->validated();
        $data['organizer_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $data['image'] = $cloudinary->upload($request->file('image'), 'events');
        }

        $event = Event::create($data);
        return response()->json($event, 201);
    }

    public function update(EventStoreRequest $request, Event $event, CloudinaryService $cloudinary)
    {
        $this->authorize('update', $event);

        $data = $request->validated();
        if ($request->hasFile('image')) {
            $data['image'] = $cloudinary->upload($request->file('image'), 'events');
        }
        $event->update($data);
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}

