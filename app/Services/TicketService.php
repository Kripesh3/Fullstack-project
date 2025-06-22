<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Mail\EventTicketMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;

class TicketService
{
    /**
     * Generate and send event ticket with QR code
     */
    public function generateAndSendTicket(Event $event, User $user)
    {
        try {
            // Create tickets directory if it doesn't exist
            $ticketsDir = storage_path('app/public/tickets');
            if (!file_exists($ticketsDir)) {
                mkdir($ticketsDir, 0755, true);
            }
            
            // Generate unique ticket ID
            $ticketId = 'TKT-' . strtoupper(Str::random(8)) . '-' . $event->id . '-' . $user->id;
            
            // Create ticket data for QR code
            $ticketData = [
                'ticket_id' => $ticketId,
                'event_id' => $event->id,
                'event_title' => $event->title,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'generated_at' => now()->toISOString(),
                'valid_until' => $event->start_date,
            ];
            
            // Generate QR code with ticket data
            $qrCodeContent = json_encode($ticketData);
            
            // Force GD backend for XAMPP compatibility
            $qrCode = QrCode::format('png')
                ->backgroundColor(255,255,255)
                ->color(0,0,0)
                ->size(300)
                ->margin(2)
                ->errorCorrection('M');
            
            try {
                // Try generating with SVG first (fallback method)
                $qrCodeSvg = QrCode::format('svg')->generate($qrCodeContent);
                
                // Convert SVG to PNG manually using GD
                $qrCodePath = 'tickets/' . $ticketId . '.svg';
                Storage::disk('public')->put($qrCodePath, $qrCodeSvg);
                
                // For now, use SVG - most browsers support it
                $fullQrCodePath = storage_path('app/public/' . $qrCodePath);
                
            } catch (\Exception $e) {
                // Fallback: create a simple text-based ticket
                Log::warning('QR generation failed, creating text ticket: ' . $e->getMessage());
                
                $textTicket = "EVENTEASE TICKET\n";
                $textTicket .= "================\n";
                $textTicket .= "Ticket ID: " . $ticketId . "\n";
                $textTicket .= "Event: " . $event->title . "\n";
                $textTicket .= "User: " . $user->name . "\n";
                $textTicket .= "Date: " . $event->start_date . "\n";
                $textTicket .= "================\n";
                $textTicket .= "Show this ticket at the event entrance\n";
                
                $qrCodePath = 'tickets/' . $ticketId . '.txt';
                Storage::disk('public')->put($qrCodePath, $textTicket);
                $fullQrCodePath = storage_path('app/public/' . $qrCodePath);
            }
            
            // Send email with ticket
            Mail::to($user->email)->send(new EventTicketMail($event, $user, $ticketId, $fullQrCodePath));
            
            // Store ticket information in the pivot table
            $event->attendees()->updateExistingPivot($user->id, [
                'ticket_id' => $ticketId,
                'qr_code_path' => $qrCodePath,
                'updated_at' => now()
            ]);
            
            return [
                'success' => true,
                'ticket_id' => $ticketId,
                'qr_code_path' => $qrCodePath,
                'message' => 'Ticket generated and sent successfully'
            ];
            
        } catch (\Exception $e) {
            Log::error('Ticket generation failed: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to generate ticket: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Verify QR code ticket
     */
    public function verifyTicket($qrCodeData)
    {
        try {
            $ticketData = json_decode($qrCodeData, true);
            
            if (!$ticketData || !isset($ticketData['ticket_id'])) {
                return [
                    'valid' => false,
                    'message' => 'Invalid QR code format'
                ];
            }
            
            // Find the event and user
            $event = Event::find($ticketData['event_id']);
            $user = User::find($ticketData['user_id']);
            
            if (!$event || !$user) {
                return [
                    'valid' => false,
                    'message' => 'Event or user not found'
                ];
            }
            
            // Check if user is registered for the event
            $attendance = $event->attendees()
                ->where('user_id', $user->id)
                ->where('ticket_id', $ticketData['ticket_id'])
                ->first();
            
            if (!$attendance) {
                return [
                    'valid' => false,
                    'message' => 'Ticket not found or not registered'
                ];
            }
            
            // Check if event has passed
            if (now()->gt($event->end_date)) {
                return [
                    'valid' => false,
                    'message' => 'Event has already ended'
                ];
            }
            
            return [
                'valid' => true,
                'message' => 'Valid ticket',
                'data' => [
                    'ticket_id' => $ticketData['ticket_id'],
                    'event' => $event,
                    'user' => $user,
                    'attendance' => $attendance
                ]
            ];
            
        } catch (\Exception $e) {
            Log::error('Ticket verification failed: ' . $e->getMessage());
            
            return [
                'valid' => false,
                'message' => 'Ticket verification failed'
            ];
        }
    }
}
