<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Event Registration Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3b82f6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .event-details {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .qr-section {
            text-align: center;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            margin-top: 30px;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Event Registration Confirmed!</h1>
        <p>You're all set for {{ $event->title }}</p>
    </div>

    <div class="content">
        <h2>Hi {{ $user->name }},</h2>
        
        <p>Great news! Your registration for <strong>{{ $event->title }}</strong> has been confirmed. We're excited to see you there!</p>

        <div class="event-details">
            <h3>📅 Event Details</h3>
            <p><strong>Event:</strong> {{ $event->title }}</p>
            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->date)->format('F j, Y') }}</p>
            <p><strong>Time:</strong> {{ \Carbon\Carbon::parse($event->time)->format('g:i A') }}</p>
            <p><strong>Location:</strong> {{ $event->location }}</p>
            <p><strong>Category:</strong> {{ $event->category->name ?? 'General' }}</p>
            @if($event->description)
            <p><strong>Description:</strong> {{ $event->description }}</p>
            @endif
        </div>

        <div class="qr-section">
            <h3>🎫 Your Event Ticket</h3>
            <p>Show this QR code at the event entrance for quick check-in:</p>
            
            <div style="margin: 20px 0;">
                {!! $qrCode !!}
            </div>
            
            <p><strong>Ticket ID:</strong> {{ $ticketId }}</p>
            <p style="font-size: 12px; color: #6b7280;">
                Keep this email handy or take a screenshot of the QR code for easy access at the event.
            </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ config('app.frontend_url') }}/events/{{ $event->id }}" class="btn">View Event Details</a>
        </div>

        <h3>📱 What's Next?</h3>
        <ul>
            <li>Save this email or screenshot the QR code</li>
            <li>Mark your calendar for {{ \Carbon\Carbon::parse($event->date)->format('F j, Y') }}</li>
            <li>Arrive 15 minutes early for smooth check-in</li>
            <li>Bring a valid ID if required</li>
        </ul>

        <p>If you have any questions or need to cancel your registration, please contact us or visit your dashboard.</p>

        <p>Looking forward to seeing you at the event!</p>
        
        <p>Best regards,<br>
        <strong>The EventEase Team</strong></p>
    </div>

    <div class="footer">
        <p>This is an automated message from EventEase. Please do not reply to this email.</p>
        <p>© {{ date('Y') }} EventEase. All rights reserved.</p>
    </div>
</body>
</html>
