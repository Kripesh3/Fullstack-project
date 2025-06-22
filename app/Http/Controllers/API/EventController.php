<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Services\TicketService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\CloudinaryService;

class EventController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Event::where('status', 'approved');

            // Filter by category - use correct field name
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by date
            if ($request->has('date')) {
                $query->where('date', $request->date);
            }

            // Filter by location
            if ($request->has('location')) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }

            // Search
            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->search . '%')
                        ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            $events = $query->with(['category', 'organizer'])
                ->withCount('attendees')
                ->orderBy('date', 'asc')
                ->paginate($request->get('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $events
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch events: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Check if user is authorized to create events (only organizers and admins)
            if ($user->role !== 'organizer' && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Only organizers can create events.'
                ], 403);
            }

            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'date' => 'required|date|after:today',
                'time' => 'required',
                'capacity' => 'required|integer|min:1',
                'category_id' => 'required|exists:event_categories,id',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'ticket_price' => 'nullable|numeric|min:0'
            ]);

            $validatedData['organizer_id'] = Auth::id();
            $validatedData['status'] = 'pending';

            // Handle image upload with Cloudinary
            if ($request->hasFile('image')) {
                $cloudinaryService = new CloudinaryService();
                $uploadResult = $cloudinaryService->uploadEventImage($request->file('image'));
                
                if ($uploadResult['success']) {
                    $validatedData['image'] = $uploadResult['url'];
                    $validatedData['image_public_id'] = $uploadResult['public_id'];
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload image: ' . $uploadResult['error']
                    ], 500);
                }
            }

            $event = Event::create($validatedData);

            return response()->json([
                'success' => true,
                'data' => $event->load(['category', 'organizer']),
                'message' => 'Event created successfully and is pending approval'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Event $event)
    {
        try {
            $event->load(['category', 'organizer']);
            $event->loadCount('attendees');

            return response()->json([
                'success' => true,
                'data' => $event
            ]);
        } catch (\Exception $e) {
            Log::error('Event not found: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, Event $event)
    {
        try {
            // Check if user owns the event or is admin
            $user = Auth::user();
            if (!$user || ($event->organizer_id != $user->id && $user->role !== 'admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'location' => 'sometimes|required|string|max:255',
                'date' => 'sometimes|required|date|after:today',
                'time' => 'sometimes|required',
                'capacity' => 'sometimes|required|integer|min:1',
                'category_id' => 'sometimes|required|exists:event_categories,id',
                'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'ticket_price' => 'sometimes|nullable|numeric|min:0'
            ]);

            // Handle image upload with Cloudinary
            if ($request->hasFile('image')) {
                // Delete old image from Cloudinary if exists
                if ($event->image_public_id) {
                    $cloudinaryService = new CloudinaryService();
                    $cloudinaryService->deleteImage($event->image_public_id);
                }

                // Upload new image to Cloudinary
                $cloudinaryService = new CloudinaryService();
                $uploadResult = $cloudinaryService->uploadEventImage($request->file('image'));
                
                if ($uploadResult['success']) {
                    $validatedData['image'] = $uploadResult['url'];
                    $validatedData['image_public_id'] = $uploadResult['public_id'];
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload image: ' . $uploadResult['error']
                    ], 500);
                }
            }

            $event->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $event->load(['category', 'organizer']),
                'message' => 'Event updated successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Event $event)
    {
        try {
            // Check if user owns the event or is admin
            $user = Auth::user();
            if (!$user || ($event->organizer_id !== $user->id && $user->role !== 'admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Delete image from Cloudinary if exists
            if ($event->image_public_id) {
                $cloudinaryService = new CloudinaryService();
                $cloudinaryService->deleteImage($event->image_public_id);
            }

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function attend(Request $request, Event $event)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Check if event is approved
            if ($event->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot attend unapproved event'
                ], 400);
            }

            // Check if event is not past
            if (Carbon::parse($event->date)->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot attend past event'
                ], 400);
            }

            // Check if already attending
            if ($event->attendees()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Already attending this event'
                ], 400);
            }

            // Check capacity
            if ($event->attendees()->count() >= $event->capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Event is full'
                ], 400);
            }

            // Register user for event
            $event->attendees()->attach($user->id);

            // Generate and send ticket via email
            $ticketService = new TicketService();
            $ticketResult = $ticketService->generateAndSendTicket($event, $user);

            if (!$ticketResult['success']) {
                // If ticket generation fails, we should log it but still allow registration
                Log::warning('Ticket generation failed for user ' . $user->id . ' and event ' . $event->id . ': ' . $ticketResult['message']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Successfully registered for event',
                'ticket_info' => $ticketResult['success'] ? [
                    'ticket_generated' => true,
                    'ticket_id' => $ticketResult['ticket_id'],
                    'message' => 'Ticket has been sent to your email'
                ] : [
                    'ticket_generated' => false,
                    'message' => 'Registration successful, but ticket generation failed. Contact support.'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to attend event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to attend event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function unattend(Request $request, Event $event)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            if (!$event->attendees()->where('user_id', $user->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered for this event'
                ], 400);
            }

            $event->attendees()->detach($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Successfully unregistered from event'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to unattend event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to unattend event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myEvents(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            $events = Event::where('organizer_id', $user->id)
                ->with(['category'])
                ->withCount('attendees')
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $events
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user events: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch your events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function attendedEvents(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }

            // Get events the user is registered for
            $events = Event::whereHas('attendees', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['category', 'organizer'])
            ->orderBy('date', 'desc')
            ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $events
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch attended events: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attended events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyTicket(Request $request)
    {
        try {
            $request->validate([
                'qr_data' => 'required|string'
            ]);

            $ticketService = new TicketService();
            $result = $ticketService->verifyTicket($request->qr_data);

            return response()->json([
                'success' => $result['valid'],
                'message' => $result['message'],
                'data' => $result['data'] ?? null
            ], $result['valid'] ? 200 : 400);

        } catch (\Exception $e) {
            Log::error('Ticket verification failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ticket verification failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
