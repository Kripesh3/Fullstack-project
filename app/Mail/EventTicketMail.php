<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;
use App\Models\User;

class EventTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public $event;
    public $user;
    public $ticketId;
    public $qrCodePath;

    /**
     * Create a new message instance.
     */
    public function __construct(Event $event, User $user, $ticketId, $qrCodePath)
    {
        $this->event = $event;
        $this->user = $user;
        $this->ticketId = $ticketId;
        $this->qrCodePath = $qrCodePath;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Event Ticket - ' . $this->event->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.event-ticket',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromPath($this->qrCodePath)
                ->as('event-ticket.png')
                ->withMime('image/png'),
        ];
    }
}
