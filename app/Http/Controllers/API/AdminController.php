<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\User;
use App\Models\EventCategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            // Calculate total attendees across all events - use a safer approach
            $totalAttendees = 0;
            try {
                $totalAttendees = DB::table('event_user')->count();
            } catch (\Exception $e) {
                // If event_user table doesn't exist or there's an error, default to 0
                Log::warning('Could not count attendees: ' . $e->getMessage());
                $totalAttendees = 0;
            }
            
            $stats = [
                'totalEvents' => Event::count(),
                'pendingEvents' => Event::where('status', 'pending')->count(),
                'approvedEvents' => Event::where('status', 'approved')->count(),
                'rejectedEvents' => Event::where('status', 'rejected')->count(),
                'totalUsers' => User::count(),
                'totalAttendees' => $totalAttendees,
                'organizers' => User::where('role', 'organizer')->count(),
                'regularUsers' => User::where('role', 'user')->count(),
                'totalCategories' => EventCategory::count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch dashboard data: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function users(Request $request)
    {
        try {
            $users = User::when($request->role, function($query, $role) {
                        return $query->where('role', $role);
                    })
                    ->when($request->search, function($query, $search) {
                        return $query->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orderBy('created_at', 'desc')
                    ->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function events(Request $request)
    {
        try {
            $events = Event::with(['category', 'organizer'])
                          ->when($request->status, function($query, $status) {
                              return $query->where('status', $status);
                          })
                          ->when($request->search, function($query, $search) {
                              return $query->where('title', 'like', "%{$search}%");
                          })
                          ->orderBy('created_at', 'desc')
                          ->paginate(15);

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

    public function approveEvent(Event $event)
    {
        try {
            $event->update(['status' => 'approved']);
            
            return response()->json([
                'success' => true,
                'message' => 'Event approved successfully',
                'data' => $event->load(['category', 'organizer'])
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to approve event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectEvent(Event $event)
    {
        try {
            $event->update(['status' => 'rejected']);
            
            return response()->json([
                'success' => true,
                'message' => 'Event rejected successfully',
                'data' => $event->load(['category', 'organizer'])
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to reject event: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser(User $user)
    {
        try {
            // Don't allow deleting other admins
            if ($user->role === 'admin' && auth()->user()->id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete other admin users'
                ], 403);
            }

            // Don't allow self-deletion
            if ($user->id === auth()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete your own account'
                ], 403);
            }

            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function banUser(User $user)
    {
        try {
            // Don't allow banning other admins
            if ($user->role === 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot ban admin users'
                ], 403);
            }

            // Don't allow self-banning
            if ($user->id === auth()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot ban your own account'
                ], 403);
            }

            if ($user->banned) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is already banned'
                ], 400);
            }

            $user->update(['banned' => true]);
            
            return response()->json([
                'success' => true,
                'message' => 'User banned successfully',
                'data' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to ban user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to ban user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function unbanUser(User $user)
    {
        try {
            if (!$user->banned) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is not banned'
                ], 400);
            }

            $user->update(['banned' => false]);
            
            return response()->json([
                'success' => true,
                'message' => 'User unbanned successfully',
                'data' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to unban user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to unban user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
